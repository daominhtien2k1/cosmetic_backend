const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const cloudinary = require("../config/cloudinaryConfig");
const {isNumber} = require("../validations/validateData");

const Account = require("../models/account.model");
const {Review} = require("../models/product.model");
const mongoose = require("mongoose");
const MAX_SIZE_IMAGE = 4 * 1024 * 1024;

const reviewsController = {};

reviewsController.get_list_reviews = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;
    var {index, count, last_id} = req.query;
    // console.log(req.query)

    if (!product_id || !index || !count) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    index = parseInt(index);
    count = parseInt(count);
    if (!isNumber(index) || !isNumber(count) || index < 0 || count < 1) return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        const reviews = await Review.find({product_id: product_id}).populate({path: 'userReview_id', model: Account}).sort("-createdAt");
        // console.log(reviews.map(review => review._id));
        if (reviews.length < 1) {
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        let index_last_id;
        if (last_id)
            index_last_id = reviews.findIndex((element) => {
                return element._id == last_id
            });
        else
            index_last_id = index - 1;
        // console.log(index_last_id);
        let sliceReviews = reviews.slice(index_last_id + 1, index_last_id + 1 + count);

        if (sliceReviews.length < 1) {
            // console.log('No have reviews');
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        let result = {
            reviews: sliceReviews.map(review => {
                const isBlocked = review.userReview_id.blockedAccounts.findIndex((element) => {
                    return element.account.toString() === req.account._id.toString()
                }) !== -1;
                let subResult = {
                    id: review._id,
                    rating: review.rating,
                    title: review.title,
                    content: review.content,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    usefuls: review.usefuls,
                    replies: review.replies,
                    author: {
                        id: review.userReview_id._id,
                        name: review.userReview_id.name,
                        avatar: review.userReview_id.getAvatar()
                    },
                    is_setted_useful: review.settedUsefulAccounts.includes(req.account._id),
                    is_blocked: isBlocked,
                    can_edit: req.account._id.equals(review.userReview_id._id) ? (review.banned ? false : true) : false,
                    banned: review.banned,
                    can_reply: review.canReply
                };

                if (review.images.length !== 0) {
                    subResult.images = review.images.map((image) => {
                        let {url, publicId} = image;
                        return {url: url, publicId: publicId};
                    });
                }
                if (review.video && review.video.url != undefined) {
                    subResult.video = {
                        url: review.video.url,
                        publicId: review.video.publicId
                    }
                }
                return subResult;
            }),
            new_items: (index_last_id + 1 - index),

        }

        if (sliceReviews.length > 0) {
            result.last_id = sliceReviews[sliceReviews.length - 1]._id
        }
        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (err) {
        console.log(err);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

reviewsController.get_list_reviews_star = expressAsyncHandler(async (req, res) => {
    let {product_id} = req.query;
    if (!product_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    try {
        // Lấy số lượng đánh giá của sản phẩm
        const reviewCount = await Review.countDocuments({ product_id: mongoose.Types.ObjectId(product_id) });

        // Lấy trung bình các rating của schema review
        const averageRating = await Review.aggregate([
            { $match: { product_id: mongoose.Types.ObjectId(product_id) } },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' }
                }
            }
        ]);

        // Lấy số lượng các review có rating là 5, 4, 3, 2, 1 sao
        const starRatings = await Review.aggregate([
            { $match: { product_id: mongoose.Types.ObjectId(product_id) } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Xây dựng kết quả trả về
        const result = {
            reviews: reviewCount,
            rating: averageRating[0] ? averageRating[0].average : 0,
            '5_star_ratings': 0,
            '4_star_ratings': 0,
            '3_star_ratings': 0,
            '2_star_ratings': 0,
            '1_star_ratings': 0
        };

        // Gán số lượng các review có rating là 5, 4, 3, 2, 1 sao vào kết quả trả về
        starRatings.forEach((rating) => {
            if (rating._id === 5) {
                result['5_star_ratings'] = rating.count;
            } else if (rating._id === 4) {
                result['4_star_ratings'] = rating.count;
            } else if (rating._id === 3) {
                result['3_star_ratings'] = rating.count;
            } else if (rating._id === 2) {
                result['2_star_ratings'] = rating.count;
            } else if (rating._id === 1) {
                result['1_star_ratings'] = rating.count;
            }
        });

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = reviewsController;