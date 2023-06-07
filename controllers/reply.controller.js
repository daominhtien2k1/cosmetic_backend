const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');

const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const {isNumber, isValidId} = require("../validations/validateData");

const Reply = require("../models/reply.model");
const {Review} = require("../models/product.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

const replyController = {}

replyController.get_reply = expressAsyncHandler(async (req, res) => {
    const {id} = req.query;
    const account = req.account;

    if (!id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    // console.log("Nếu không có return thì vẫn gọi tiếp dòng lệnh này dù bên trên đã send. Phải có return trước");
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    //Check User account is banned or not
    if (account.isBlocked) setAndSendResponse(res, responseError.NOT_ACCESS);

    const review = await Review.findById(id);

    if (review == null) return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
    if (review.banned) return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);

    //Check User is being blocked by Review's author
    const reviewAuthor = await Account.findById(review.userReview_id);
    const isBlocked = reviewAuthor.blockedAccounts.findIndex((element) => {
        return element.account.toString() === account._id.toString()
    }) !== -1;
    if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người viết đã chặn bạn, do đó không thể lấy thông tin review');

    //Check User is blocking Review's author
    const isBlocking = account.blockedAccounts.findIndex((element) => {
        return element.account.toString() === reviewAuthor._id.toString()
    }) !== -1;

    if (isBlocking) return callRes(res, responseError.NOT_ACCESS, 'Bạn đã chặn người viết, do đó không thể lấy thông tin review');

    //Get and check all replies
    const blockingList = account.blockedAccounts.map(x => x.account);
    const replyList = await Reply.find({
        review_id: id, userReply_id: {$nin: blockingList}
    })  .populate({path: 'userReply_id', model: Account});

    let replies = replyList.map((reply) => {
        return {
            id: reply.id,
            reply: reply.content,
            createdAt: reply.createdAt,
            poster: {
                id: reply.userReply_id._id,
                name: reply.userReply_id.name,
                avatar: reply.userReply_id.getAvatar()
            }
        }
    });

    const result  = {
        replies : replies
    };

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
    });

});

replyController.set_reply = expressAsyncHandler(async (req, res) => {
    const {id, reply} = req.body;
    const account = req.account;

    if (!id || !reply) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(id)) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    if (account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let review = await Review.findById(id);

        if (review == null) return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        if (review.banned) return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);

        //Check User is being blocked by Review's author
        const reviewAuthor = await Account.findById(review.userReview_id);
        const isBlocked = reviewAuthor.blockedAccounts.findIndex((element) => {
            return element.account.toString() === account._id.toString()
        }) !== -1;
        if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người viết đã chặn bạn, do đó không thể gửi phản hồi');

        //Check User is blocking Review's author
        const isBlocking = account.blockedAccounts.findIndex((element) => {
            return element.account.toString() === reviewAuthor._id.toString()
        }) !== -1;

        if (isBlocking) return callRes(res, responseError.NOT_ACCESS, 'Bạn đã chặn người viết, do đó không thể gửi phản hồi');

        //Save new comment
        let myReply = await new Reply({
            review_id: id, userReply_id: account._id, content: reply
        }).save();

        //Update comments in postmodel
        const replies = await Reply.find({review_id: id});
        const replyCount = replies.length;
        const updateReview = await Review.findByIdAndUpdate(id, {
            $set: {
                replies: replyCount,
                replyList: replies.map(reply => reply._id)
            }
        }, {
            new: true
        });

        const newReply = await Reply.findById(myReply.id).populate({path: 'userReply_id', model: Account});

        const result = {
            id: newReply.id,
            reply: newReply.content,
            createdAt: newReply.createdAt,
            poster: {
                id: newReply.userReply_id._id,
                name: newReply.userReply_id.name,
                avatar: newReply.userReply_id.getAvatar()
            }
        };

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });

    } catch (error) {
        setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

module.exports = replyController;