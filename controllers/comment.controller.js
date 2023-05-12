const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const {setAndSendResponse, responseError} = require('../constants/response_code');
const {isNumber, isValidId} = require("../validations/validateData");

const commentController = {};

commentController.get_comment = expressAsyncHandler(async (req, res) => {
    const {id} = req.query;
    const account = req.account;

    if (!id) setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(id)) setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    //Check User account is banned or not
    if (account.isBlocked) setAndSendResponse(res, responseError.NOT_ACCESS);

    //load Post banned or not
    const post = await Post.findById(id);

    if (post == null) return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    if (post.banned) return setAndSendResponse(res, responseError.POST_IS_BANNED);

    //Check User is being blocked by Post's author
    const postAuthor = await Account.findById(post.account_id);

    const beingBlocked = [];
    for (let value of postAuthor.blockedAccounts) {
        beingBlocked.push(value.account);
    }
    for (let item of beingBlocked) {
        if (item.toString() === account._id.toString()) setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    //Check User block Post's author
    const blockingList = [];
    for (let value of account.blockedAccounts) {
        blockingList.push(value.account);
    }
    for (let item of blockingList) {
        if (item.toString() === postAuthor._id.toString()) setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    //Get and check all comments
    const commentList = await Comment.find({
        post_id: id, userComment_id: {$nin: blockingList}
    })  .populate({path: 'userComment_id', model: Account})
        .sort("-createdAt");

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: commentsToData(commentList)
    });

});

commentController.set_comment = expressAsyncHandler(async (req, res) => {
    const {id, comment} = req.body;
    const account = req.account;

    if (!id || !comment) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    //Check Account isBlock ?
    if (account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    //Check number of letters in comment  
    if (comment.trim().length === 0 || comment.length > 500) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    if (!isValidId(id)) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    try {
        let post = await Post.findById(id);

        if (post == null) return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        if (post.banned) return setAndSendResponse(res, responseError.POST_IS_BANNED);

        //Check User is being blocked by Post's author
        const postAuthor = await Account.findById(post.account_id);

        const beingBlocked = [];
        for (let value of postAuthor.blockedAccounts) {
            beingBlocked.push(value.account);
        }
        for (let item of beingBlocked) {
            if (item.toString() === account._id.toString()) setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        }

        //Save new comment
        let myCmt = await new Comment({
            post_id: id, userComment_id: account._id, content: comment
        }).save();

        //Update comments in postmodel
        const comments = await Comment.find({post_id: id});
        const commentCount = comments.length;
        const updatePost = await Post.findByIdAndUpdate(id, {
            $set: {
                comments: commentCount,
                commentList: comments.map(comment => comment._id)
            }
        }, {
            new: true
        });

        //Update commentList in postmodel


        //Get user blockList
        const blockingList = [];
        for (let value of account.blockedAccounts) {
            blockingList.push(value.account);
        }

        //Get all comments
        const commentList = await Comment.find({
            post_id: id, userComment_id: {$nin: blockingList}
        })  .sort("-createdAt");

        //Get all commenters
        let cmterIds = commentList.map(cmt => cmt.userComment_id);

        let cmters = await Account.find({_id: {$in: cmterIds}});

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: commentMapper(commentList, cmters)
        });

    } catch (error) {
        setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

module.exports = commentController;

function commentsToData(commentList) {
    const data = [];
    for (let cmt of commentList) {
        data.push(commentToData(cmt))
    }
    return {
        commentList: data
    };
}

function commentToData(comment) {
    const commenter = comment.userComment_id;
    return {
        id: comment._id, comment: comment.content, createdAt: comment.createdAt,
        poster: {
            id: commenter._id,
            name: commenter.name,
            avatar: commenter.getAvatar()
        }
    }
}

function commentMapper(cmts, cmters) {
    let commentListData = cmts.map(cmt => {
        let cmter = cmters.find(cmter => cmter._id.equals(cmt.userComment_id));

        return {
            id: cmt._id, comment: cmt.content, createdAt: cmt.createdAt,
            poster: {
                id: cmter._id,
                name: cmter.name,
                avatar: cmter.getAvatar()
            }
        }
    });
    return { commentList: commentListData };
}