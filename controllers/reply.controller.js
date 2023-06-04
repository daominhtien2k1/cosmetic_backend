const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');

const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const {isNumber, isValidId} = require("../validations/validateData");

const Reply = require("../models/reply.model");
const {Review} = require("../models/product.model");

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
    const blockingList = account.blockedAccounts.map(x => x.account);
    const isBlocking = account.blockedAccounts.findIndex((element) => {
        return element.account.toString() === reviewAuthor._id.toString()
    }) !== -1;

    if (isBlocking) return callRes(res, responseError.NOT_ACCESS, 'Bạn đã chặn người viết, do đó không thể lấy thông tin review');

    //Get and check all comments
    const replyList = await Reply.find({
        review_id: id, userReply_id: {$nin: blockingList}
    })  .populate({path: 'userReply_id', model: Account})
        .sort("-createdAt");

    res.send(replyList);

});


module.exports = replyController;