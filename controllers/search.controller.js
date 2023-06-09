const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Search = require("../models/search.model");
const {setAndSendResponse, responseError} = require('../constants/response_code');
const {isNumber} = require("../validations/validateData");
const Post = require("../models/post.model");
const Account = require("../models/account.model");
const {Review, Product, Characteristic} = require("../models/product.model");

const searchByArray = ["Product", "Review", "Instruction review", "Post", "Account", "Brand"];

const searchController = {};

searchController.search_sth = expressAsyncHandler(async (req,res) => {
    let { keyword, index, count, searchBy} = req.query;

    if (!keyword || !searchBy) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!index || !count) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (searchBy && !searchByArray.includes(searchBy)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    index = parseInt(index);
    count = parseInt(count);
    if (!isNumber(index) || !isNumber(count) || index < 0 || count < 1) return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);

    const search = Search({account_id: req.account._id, keyword: keyword});
    await search.save();

    try {
        if (searchBy === "Post") {
            // condition 1: match exactly
            // const posts = await Post.find({$text: {$search: `\"${keyword}\"`}}).populate({path: 'account_id', model: Account}).sort("-createdAt");

            // condition 2: one of the words
            const posts = await Post.find({$text: {$search: keyword}}).populate({
                path: 'account_id',
                model: Account
            }).sort("-createdAt");

            if (posts.length < 1) {
                return setAndSendResponse(res, responseError.NO_DATA);
            }

            let result = {
                foundedPosts: posts.map(post => {
                    const isBlocked = post.account_id.blockedAccounts.findIndex((element) => {
                        return element.account.toString() === req.account._id.toString()
                    }) !== -1;
                    let subResult = {
                        id: post._id,
                        described: post.described,
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        likes: post.likes,
                        comments: post.comments,
                        author: {
                            id: post.account_id._id,
                            name: post.account_id.name,
                            avatar: post.account_id.getAvatar()
                        },
                        is_liked: post.likedAccounts.includes(req.account._id),
                        status: post.status,
                        is_blocked: isBlocked,
                        can_edit: req.account._id.equals(post.account_id._id) ? (post.banned ? false : true) : false,
                        banned: post.banned,
                        can_comment: post.canComment,
                        classification: post.classification,
                    };
                    if (post.images.length !== 0) {
                        subResult.images = post.images.map((image) => {
                            let {url, publicId} = image;
                            return {url: url, publicId: publicId};
                        });
                    }
                    if (post.video && post.video.url != undefined) {
                        subResult.video = {
                            url: post.video.url,
                            publicId: post.getVideoThumb()
                        }
                    }
                    return subResult;
                }),
                founds: posts.length
            }

            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: result
            });
        }

        if (searchBy === "Review") {
            const reviews = await Review.find({ $text: {$search: keyword}, classification: {$in: ["Standard", "Detail"]} })
                .populate({path: 'userReview_id', model: Account})
                .populate({path: 'product_id', model: Product, select: ['_id', 'name', 'images']})
                .sort("-createdAt");

            if (reviews.length < 1) {
                return setAndSendResponse(res, responseError.NO_DATA);
            }

            let result = {
                foundedReviews: await Promise.all(reviews.map(async review => {
                    const isBlocked = review.userReview_id.blockedAccounts.findIndex((element) => {
                        return element.account.toString() === req.account._id.toString()
                    }) !== -1;

                    const isBlocking = req.account.blockedAccounts.findIndex((element) => {
                        return element.account.toString() === review.userReview_id._id.toString()
                    }) !== -1;

                    let subResult;

                    if (review.classification == "Standard") {
                        subResult = {
                            id: review._id,
                            product: review.product_id,
                            classification: review.classification,
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
                            is_blocked: isBlocked || isBlocking,
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

                    } else if (review.classification == "Detail") {
                        let characteristic_reviews_result = [];
                        for (let characteristic_review of review["characteristic_reviews"]) {
                            let characteristic = await Characteristic.findOne({_id: characteristic_review["characteristic_id"]});
                            characteristic_reviews_result.push({
                                characteristic_id: characteristic._id,
                                criteria: characteristic.criteria,
                                point: characteristic_review["point"]
                            })
                        }

                        subResult = {
                            id: review._id,
                            product: review.product_id,
                            classification: review.classification,
                            rating: review.rating,
                            title: review.title,
                            content: review.content,
                            characteristic_reviews: characteristic_reviews_result,
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
                            is_blocked: isBlocked || isBlocking,
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
                    }

                    return subResult;
                })),
                founds: reviews.length
            };

            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: result
            });
        }

    } catch (e) {
        console.log(e);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

searchController.get_saved_search = expressAsyncHandler(async (req,res) => {
    let searchList = [];

    searchList = await Search.find({
        account_id: req.account._id
    })
    .limit(5)
    .sort("-createdAt");

    if(searchList.length < 1)
    {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: searchList
    });
});

searchController.del_saved_search = expressAsyncHandler(async (req,res) => {
    const {search_id} = req.body;

    let search = await Search.findOne({
        account_id: req.account._id,
        _id: new ObjectId(search_id)
    })

    if(!search) return setAndSendResponse(res, responseError.NO_DATA);
    else Search.deleteOne(
        search,
        (err, result) => {
            if(err){
                return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
            }else{
                return setAndSendResponse(res, responseError.OK, search_id)
            }
        }
    )
});

module.exports = searchController;