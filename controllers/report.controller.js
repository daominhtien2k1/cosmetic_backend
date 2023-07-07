const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');

const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const {isNumber, isValidId} = require("../validations/validateData");
const Report = require("../models/report.model");
const Post = require("../models/post.model");
const {Review} = require("../models/product.model");

const reportsController = {};

// đang để tạm người dùng khác
reportsController.get_list_reported_posts = expressAsyncHandler(async (req, res) => {
    const reports = await Report.find({post_id: { $ne: null } }).populate({path: 'post_id', model: Post}).sort("-createdAt");
    const resultsMustFilter = reports.map((report) => {
       return {
           status: report.status,
           subject: report.subject,
           details: report.subject,
           post_id: report.post_id._id,
           account_id: report.post_id.account_id,
           postDescribed: report.post_id.described
       }
    });

    const results = resultsMustFilter.filter((e) => e.account_id.toString() == req.account._id.toString());

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: results
    });
});

reportsController.get_list_reported_reviews = expressAsyncHandler(async (req, res) => {
    const reports = await Report.find({review_id: { $ne: null } })
        .populate({
            path: 'review_id',
            model: Review,
            populate: {
                path: 'product_id',
                model: 'Product',
            },
        })
        .sort("-createdAt");
    const resultsMustFilter = reports.map((report) => {
        return {
            status: report.status,
            subject: report.subject,
            details: report.subject,
            review_id: report.review_id._id,
            productImage: report.review_id.product_id.images[0].url,
            productName: report.review_id.product_id.name,
            account_id: report.review_id.userReview_id,
            reviewTitle: report.review_id.title,
            reviewRating: report.review_id.rating,
            reviewContent: report.review_id.content
        }
    });

    const results = resultsMustFilter.filter((e) => e.account_id.toString() != req.account._id.toString());

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: results
    });
});

module.exports = reportsController;
