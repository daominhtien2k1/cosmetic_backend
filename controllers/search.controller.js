const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Search = require("../models/search.model");
const {setAndSendResponse, responseError} = require('../constants/response_code');
const {isNumber} = require("../validations/validateData");
const Post = require("../models/post.model");
const Account = require("../models/account.model");
const {Review, Product, Characteristic, Brand} = require("../models/product.model");

const searchByArray = ["Product", "Review", "Instruction review", "Post", "Account", "Brand"];

const searchController = {};

searchController.search_sth = expressAsyncHandler(async (req,res) => {
    let { keyword, searchBy} = req.query;

    if (!keyword || !searchBy) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (searchBy && !searchByArray.includes(searchBy)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    const search = Search({account_id: req.account._id, keyword: keyword});
    await search.save();

    try {
        if (searchBy === "Product") {
            const products = await Product.find({$text: {$search: keyword}});
            if (products.length < 1) {
                return setAndSendResponse(res, responseError.NO_DATA);
            }

            let result = {
                foundedProducts: products.map(product => {
                    return {
                        id: product._id,
                        slug: product.slug,
                        name: product.name,
                        image: product.images[0],
                        reviews: product.reviews,
                        rating: product.rating,
                        loves: product.loves
                    };
                }),
                founds: products.length
            }

            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: result
            });
        }

        if (searchBy === "Brand") {
            const brands = await Brand.find({$text: {$search: keyword}});
            if (brands.length < 1) {
                return setAndSendResponse(res, responseError.NO_DATA);
            }

            let result = {
                foundedBrands: brands.map(brand => {
                    return {
                        id: brand._id,
                        slug: brand.slug,
                        name: brand.name,
                        image: brand.image.url,
                        is_followed: false
                    }
                }),
                founds: brands.length
            }

            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: result
            });
        }

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

        if (searchBy === "Account") {
            const accounts = await Account.find({$text: {$search: keyword}});
            if (accounts.length < 1) {
                return setAndSendResponse(res, responseError.NO_DATA);
            }

            const list_my_friend = req.account.friends;
            const list_my_sent = req.account.friendRequestSent;
            const list_my_received = req.account.friendRequestReceived;
            const list_my_blocked_accounts = req.account.blockedAccounts;

            let result = {
                foundedAccounts: accounts.map(account => {
                    const list_blocked_accounts_of_account = account.blockedAccounts;

                    let statusFriend = "Unknown";
                    // console.log(list_my_friend.find(element => element.friend.toString() === account._id.toString()))
                    // console.log(list_my_friend.find(element => element.friend == account._id.toString()))
                    if (req.account.id === account._id.toString()) {
                        statusFriend = "Me";
                    } else if (list_my_friend.find(element => element.friend.toString() === account._id.toString()) != null) {
                        statusFriend = "Friend";
                    } else if (list_my_sent.find(element => element.toUser.toString() === account._id.toString()) != null) {
                        statusFriend = "Sent friend request";
                    } else if (list_my_received.find(element => element.fromUser.toString() === account._id.toString()) != null) {
                        statusFriend = "Received friend request";
                    } else if ( list_my_blocked_accounts.find(element => element.account.toString() === account._id.toString()) != null
                        || list_blocked_accounts_of_account.find(element => element.account.toString() === req.account._id.toString()) != null ) {
                        statusFriend = "Block";
                    } else {
                        statusFriend = "Unknown";
                    }
                    return {
                        id: account._id,
                        avatar: account.avatar.url,
                        name: account.name,
                        level: account.level,
                        statusFriend: statusFriend

                    }
                }),
                founds: accounts.length
            }

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
    try {
        // const uniqueKeywords = await Search.distinct('keyword');
        const limit = 5;
        let count = 0;

        const searches = await Search.find({account_id: req.account._id}).select("-__v").sort({ createdAt: -1 });

        const uniqueSearches = [];
        const uniqueKeywords = new Set();

        searches.forEach((search) => {
            if (!uniqueKeywords.has(search.keyword) && count < limit) {
                uniqueKeywords.add(search.keyword);
                uniqueSearches.push(search);

                count++;
            }
        });

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: uniqueSearches
        });
    } catch (error) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }


});

searchController.del_saved_search = expressAsyncHandler(async (req,res) => {
    const {id} = req.query;

    if (!id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    try {

        const search = await Search.findById(id);

        await Search.remove({keyword: search.keyword});

        // trả lại
        const limit = 5;
        let count = 0;
        const searches = await Search.find({account_id: req.account._id}).select("-__v").sort({ createdAt: -1 });

        const uniqueSearches = [];
        const uniqueKeywords = new Set();

        searches.forEach((search) => {
            if (!uniqueKeywords.has(search.keyword) && count < limit) {
                uniqueKeywords.add(search.keyword);
                uniqueSearches.push(search);

                count++;
            }
        });

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: uniqueSearches
        });
    } catch (error) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }

});

searchController.get_list_top_searches = expressAsyncHandler(async (req,res) => {
    try {
        const topSearches = await Search.aggregate([
            { $group: { _id: '$keyword', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        if (topSearches.length < 1) return setAndSendResponse(res, responseError.NO_DATA);

        const result = topSearches.map(s => {
            return {
                keyword: s._id,
                count: s.count
            }
        });

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });

    } catch (error) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

searchController.search_suggestions = expressAsyncHandler(async (req,res) => {
    const search_suggestion_pool = ["Son", "Son dưỡng môi", "Son kem lì", "Son thỏi the", "Son bút chì", "Sữa tẩy", "Sữa rửa mặt", "Sữa dưỡng thể", "Sữa dưỡng da", "Sữa tẩy trang", "Sữa dưỡng ẩm",
        "Sữa chống nắng", "Sữa dưỡng the", "Sữa tắm hương", "Sữa dưỡng trắng", "Sữa tắm tony", "Sữa tắm tạo bọt", "Sữa rửa mặt dạng gel",
        "Sữa rửa mặt cho nam", "Sữa sạch da 3 in 1", "Sữa sạch tế bào chết", "Sữa sạch mụn đầu đen", "Sữa sạch sâu và sáng da"];


    try {
        const searchString = req.query.searchString;
        const regex = new RegExp(searchString, 'i');

        const searchSuggestions = search_suggestion_pool.filter((item) => item.startsWith(searchString));

        const htmlSuggestions = searchSuggestions.map((suggestion) => {
            // const highlightedText = suggestion.replace(regex, `<b>${searchString}</b>`);

            const spaceIndex = suggestion.indexOf(" ", searchString.length);

            let firstWord;
            let secondWord;
            let thirdWord;
            firstWord = searchString;
            if (spaceIndex != -1) { // nếu tìm thấy dấu cách thì lấy đến đoạn dấu cách
                secondWord = suggestion.substring(searchString.length, spaceIndex).trim();
                thirdWord = suggestion.substring(spaceIndex).trim();
            } else { // không thấy thì lấy hết phần còn lại
                secondWord = suggestion.substring(searchString.length).trim();
                thirdWord = "";
            }

            let highlightedText;
            if (secondWord == "" && thirdWord == "") {
                highlightedText = firstWord;
            } else if (secondWord != "" && thirdWord != "") { // nửa của từ
                highlightedText = `${firstWord}<b>${secondWord} ${thirdWord}</b>`;
            } else if (secondWord != "" && thirdWord == "") {
                highlightedText = `${firstWord}<b>${secondWord}</b>`;
            } else if (secondWord == "" && thirdWord != "") { // trọn từ
                highlightedText = `${firstWord} <b>${thirdWord}</b>`;
            }

            return highlightedText;
        });

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: htmlSuggestions
        });

    } catch (error) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

module.exports = searchController;