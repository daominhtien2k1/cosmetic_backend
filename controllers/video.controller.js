const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');
const Post = require("../models/post.model");
const Video = require('../models/video.model');
const {setAndSendResponse, responseError} = require('../constants/response_code');
const {isNumber, isValidId} = require("../validations/validateData");

const videosController = {};
videosController.get_video = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    // chưa tìm được cách nhập /:id mà trả về undefined
    if (id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }
    let video = await Video.findById(id);
    if (video == null) {
        return setAndSendResponse(res, responseError.VIDEO_IS_NOT_EXISTED);
    }
    const result = {
        id: video._id,
        described: video.described,
        video: {
            url: video.video.url,
            publicId: video.video.publicId
        },
        isAdsCampaign: video.isAdsCampaign,
        createdAt: video.createdAt.toString(),
        updatedAt: video.updatedAt.toString(),
        likes: video.likes,
        is_liked: video.likedAccounts.includes(req.account._id),
    };
    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
    });
});

videosController.get_list_videos = expressAsyncHandler(async (req, res) => {
    const videos = await Video.find();
    if (videos == null) {
        return setAndSendResponse(res, responseError.VIDEO_IS_NOT_EXISTED);
    }
    const result = {
        videos: videos.map(video => {
            return {
                id: video._id,
                described: video.described,
                video: {
                    url: video.video.url,
                    publicId: video.video.publicId
                },
                isAdsCampaign: video.isAdsCampaign,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt,
                likes: video.likes,
                is_liked: video.likedAccounts.includes(req.account._id),
            }
        })
    }

    // const result = {
    //     videos: videos.map(video => {
    //         return {
    //             described: video.described,
    //             video: {
    //                 filename: video.video.filename,
    //                 url: video.video.url,
    //                 publicId: video.video.publicId
    //             },
    //             isAdsCampaign: video.isAdsCampaign,
    //             likes: video.likes,
    //             likedAccounts: video.likedAccounts,
    //         }
    //     })
    // }
    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
        // result
    });
});

videosController.like_video = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    const account = req.account;
    console.log(account)
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let video = await Video.findById(id);
        // console.log("đã tìm được video")
        // console.log(video)
        if (video == null) {
            return setAndSendResponse(res, responseError.VIDEO_IS_NOT_EXISTED);
        }

        if (
            video.likedAccounts.findIndex((element) => {
                return element.equals(account._id);
            }) != -1
        )
            return setAndSendResponse(res, responseError.HAS_BEEN_LIKED);
        else {
            console.log("đã qua")
            await Video.findOneAndUpdate(
                {_id: id},
                {$push: {likedAccounts: {_id: account._id}}}
            );
            console.log("đã qua")
            var updatedVideo = await Video.findOneAndUpdate({_id: id}, {$inc: {likes: 1}}, { new: true });
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    likes: updatedVideo.likes
                }
            });
        }
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

videosController.unlike_video = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    const account = req.account;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let video = await Video.findById(id);
        if (video == null) {
            return setAndSendResponse(res, responseError.VIDEO_IS_NOT_EXISTED);
        }

        if (
            video.likedAccounts.findIndex((element) => {
                return element.equals(account._id);
            }) == -1
        )
            return setAndSendResponse(res, responseError.HAS_NOT_BEEN_LIKED);
        else {
            await Video.findOneAndUpdate(
                {_id: id},
                {$pull: {likedAccounts:  account._id}}
            );
            var updatedVideo = await Video.findOneAndUpdate({_id: id}, {$inc: {likes: -1}}, { new: true });
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    likes: updatedVideo.likes
                }
            })
            console.log(video.likedAccounts);
        }
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});


module.exports = videosController;