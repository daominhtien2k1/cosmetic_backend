const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const cloudinary = require("../config/cloudinaryConfig");
const {isNumber, isValidId} = require("../validations/validateData");

const Account = require("../models/account.model");
const {Review, Characteristic, Product} = require("../models/product.model");
const mongoose = require("mongoose");

const MAX_IMAGE_NUMBER = 4;
const MAX_SIZE_IMAGE = 4 * 1024 * 1024; // for 4MB
const MAX_VIDEO_NUMBER = 1;
const MAX_SIZE_VIDEO = 10 * 1024 * 1024; // for 10MB
const MAX_CHARACTER_REVIEW_CONTENT = 50000; // đánh giá tiêu chuẩn max là 200, nhưng review hướng dẫn thì max 50000 chữ cái
const MIN_CHARACTER_REVIEW_CONTENT = 50;
const MAX_CHARACTER_REVIEW_TITLE = 100;

const classificationArray =  ["Quick", "Standard", "Detail", "Instruction"];

const reviewsController = {};

// Standard, Detail, Instruction
reviewsController.get_review = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        const review = await Review.findOne({_id: id, classification: { $in: ["Standard", "Detail", "Instruction"] } })
            .populate({path: 'userReview_id', model: Account, select: ['_id', 'name', 'avatar.url']} )
            .populate( {path: 'settedUsefulAccounts', model: Account, select: ['_id', 'name', 'avatar.url']} )
            .populate( {path: 'product_id', model: Product, select: ['_id', 'name', 'images']})
        ;
        if (review == null) {
            return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        }

        if (review.banned) {
            return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);
        }



        //Check User is being blocked by Review's author
        const reviewAuthor = await Account.findById(review.userReview_id._id);
        const isBlocked = reviewAuthor.blockedAccounts.findIndex((element) => {
            return element.account.toString() === req.account._id.toString()
        }) !== -1;
        if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người viết đã chặn bạn, do đó không thể lấy thông tin review');

        //Check User is blocking Review's author
        const blockingList = req.account.blockedAccounts.map(x => x.account);
        const isBlocking = req.account.blockedAccounts.findIndex((element) => {
            return element.account.toString() === reviewAuthor._id.toString()
        }) !== -1;

        if (isBlocking) return callRes(res, responseError.NOT_ACCESS, 'Bạn đã chặn người viết, do đó không thể lấy thông tin review');

        // Quyết định giữ nguyên trường is_blocked để biết đâu có thể tái sử dụng model, và cho giống với get_list_reviews
        let result = {
            id: review._id,
            product: review.product_id,
            classification: review.classification,
            settedUsefulAccounts: review.settedUsefulAccounts,
            title : review.title,
            content : review.content,
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

        if (review.classification != "Instruction") {
            result.rating = review.rating;
        }

        if (review.classification == "Detail") {
            let characteristic_review_results = [];
            for (let characteristic_review of review["characteristic_reviews"]) {
                let characteristic = await Characteristic.findOne({_id: characteristic_review["characteristic_id"]});
                characteristic_review_results.push({
                    characteristic: characteristic.criteria,
                    point: characteristic_review["point"]
                })
            }
            result.characteristic_review_results = characteristic_review_results;
        }


        if (review.images.length !== 0) {
            result.images = review.images.map((image) => {
                let {url, publicId} = image;
                return {url: url, publicId: publicId};
            });
        }
        if (review.video && review.video.url != undefined) {
            result.video = {
                url: review.video.url,
                publicId: review.video.publicId
            }
        }

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (error) {
        console.log(error)
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }

});

// Standard & Detail
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
        const reviews = await Review.find({product_id: product_id, classification: { $in: ["Standard", "Detail"] }}).populate({path: 'userReview_id', model: Account}).sort("-createdAt");
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

        // quyết định trả về tất cả các bài review kể cả bị blocked, để last_index hoạt động dễ hơn, và sẽ lọc trong frontend
        // và trả lại tất cả bài viết để đếm số lượng tất cả
        let result = {
            reviews: await Promise.all(sliceReviews.map(async review => {
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
                    let characteristic_review_results = [];
                    for (let characteristic_review of review["characteristic_reviews"]) {
                        let characteristic = await Characteristic.findOne({_id: characteristic_review["characteristic_id"]});
                        characteristic_review_results.push({
                            characteristic: characteristic.criteria,
                            point: characteristic_review["point"]
                        })
                    }

                    subResult = {
                        id: review._id,
                        classification: review.classification,
                        rating: review.rating,
                        title: review.title,
                        content: review.content,
                        characteristic_review_results: characteristic_review_results,
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

// Instruction
reviewsController.get_list_instruction_reviews = expressAsyncHandler(async (req, res) => {
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
        const reviews = await Review.find({product_id: product_id, classification: "Instruction" }).populate({path: 'userReview_id', model: Account}).sort("-createdAt");
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
            reviews: await Promise.all(sliceReviews.map(async review => {
                const isBlocked = review.userReview_id.blockedAccounts.findIndex((element) => {
                    return element.account.toString() === req.account._id.toString()
                }) !== -1;

                const isBlocking = req.account.blockedAccounts.findIndex((element) => {
                    return element.account.toString() === review.userReview_id._id.toString()
                }) !== -1;

                let subResult;

                if (review.classification == "Instruction") {
                    subResult = {
                        id: review._id,
                        classification: review.classification,
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

                }

                return subResult;
            })),
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
        const reviewCount = await Review.countDocuments({ product_id: mongoose.Types.ObjectId(product_id), classification: { $in: ["Quick", "Standard", "Detail"] } });

        // Lấy trung bình các rating của schema review
        const averageRating = await Review.aggregate([
            { $match: { product_id: mongoose.Types.ObjectId(product_id), classification: { $in: ["Quick", "Standard", "Detail"] } } },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' }
                }
            }
        ]);

        // Lấy số lượng các review có rating là 5, 4, 3, 2, 1 sao
        const starRatings = await Review.aggregate([
            { $match: { product_id: mongoose.Types.ObjectId(product_id), classification: { $in: ["Quick", "Standard", "Detail"] } } },
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
            rating: averageRating[0] ? parseFloat(averageRating[0].average.toFixed(1)) : 0,
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

reviewsController.get_list_recent_reviews = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;

    const limit = 2;

    if (!product_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);


    try {
        const reviews = await Review.find({product_id: product_id}).limit(limit).sort("-createdAt");
        // console.log(reviews.map(review => review._id));
        if (reviews.length < 1) {
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: {
                reviews
            }
        });
    } catch (err) {
        console.log(err);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

reviewsController.product_characteristic_statistics = expressAsyncHandler(async (req, res) => {
    let { product_id } = req.query;
    if (!product_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(product_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }
    const reviews = await Review.find({ product_id: product_id, classification: "Detail" }).select("characteristic_reviews -_id");
    const characteristics = await Characteristic.find({ product_id: product_id }).select("criteria _id");

    // Ở đây đã xử lí test case, ban đầu có 6 thuộc tính, user1 đánh giá 6 thuộc tính, rồi admin thêm mới 1 thuộc tính, user2 đánh giá 7 thuộc tính
    // Tính tổng điểm và số lượng đánh giá cho từng characteristic
    let characteristicMap = new Map();
    characteristics.forEach((c) => {
        characteristicMap.set(c._id.toString(), {
            characteristic_id: c._id,
            criteria: c.criteria,
            totalPoint: 0,
            totalReviews: 0,
        });
    });

    reviews.forEach((r) => {
        let characteristic_reviews = r["characteristic_reviews"];
        characteristic_reviews.forEach((cr) => {
            let characteristic = characteristicMap.get(cr.characteristic_id.toString());
            if (characteristic) {
                characteristic.totalPoint += cr.point;
                characteristic.totalReviews += 1;
            }
        });
    });

    // Tạo kết quả cuối cùng
    let result = {
        totalReviews: reviews.length,
        listCriteria: [],
    };

    characteristicMap.forEach((characteristic) => {
        let averagePoint = characteristic.totalReviews > 0 ? characteristic.totalPoint / characteristic.totalReviews : 0;
        result.listCriteria.push({
            characteristic_id: characteristic.characteristic_id,
            criteria: characteristic.criteria,
            totalPoint: characteristic.totalPoint,
            averagePoint: averagePoint,
        });

        // Không cần new: true vì không cần await trả về kết quả
        Characteristic.findByIdAndUpdate(characteristic.characteristic_id, { ratings: averagePoint, reviews: characteristic.totalReviews }).exec();

    });

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
    });
});

reviewsController.add_review = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;
    const {classification, characteristic_reviews, rating, title, content } = req.body;

    let image, video;
    if (req.files) {
        image = req.files.image;
        video = req.files.video
    }

    if (!classification || !product_id) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }

    if (classification === "Quick" && !rating) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }

    if (classification === "Standard" && (!rating || !title || !content)) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }

    if (classification === "Detail" && (!rating || !title || !content || !characteristic_reviews)) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }

    if (classification === "Instruction" && (!title || !content)) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }

    if (title && title.length > MAX_CHARACTER_REVIEW_TITLE ) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (content && (content.length > MAX_CHARACTER_REVIEW_CONTENT || content.length < MIN_CHARACTER_REVIEW_CONTENT) ) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (classification && !classificationArray.includes(classification)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.files && image && video) {
        // console.log("có cả ảnh và video => từ chối");
        return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
    }

    let review = Review();

    if (image) {  //upload ảnh
        // middleware đã check nhưng chung cho cả video và ảnh nên check lại
        if (image.length > MAX_IMAGE_NUMBER) {
            return setAndSendResponse(res, responseError.MAXIMUM_NUMBER_OF_IMAGES);
        }

        for (const item_image of image) {
            // middleware đã check rồi, nên không cần nữa
            // const filetypes  = /jpeg|jpg|png/;
            // const mimetype = filetypes.test(item_image.mimetype);

            // if(!mimetype) {
            //     return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
            // }

            if (item_image.buffer.bytelength > MAX_SIZE_IMAGE) {
                return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
            }
        }


        try {
            let uploadPromises = image.map(cloudinary.uploads);
            let data = await Promise.all(uploadPromises);
            //xửa lý data
            post.images = data;
        } catch (err) {
            //lỗi không xác định
            // console.log(err);
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }
    }

    if (video) { //upload video
        if (video.length > MAX_VIDEO_NUMBER) {
            // console.log("MAX_VIDEO_NUMBER");
            return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
        }

        for (const item_video of video) {
            const filetypes = /mp4/;
            const mimetype = filetypes.test(item_video.mimetype);
            if (!mimetype) {
                // console.log("Mimetype video is invalid");
                return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
            }

            if (item_video.buffer.byteLength > MAX_SIZE_VIDEO) {
                // console.log("Max video file size");
                return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
            }
        }
        try {
            let data = await cloudinary.uploads(video[0]);
            //xử lý data
            post.video = data;
        } catch (error) {
            //lỗi không xác định
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }
    }

    review.userReview_id = req.account._id;
    review.product_id = product_id;
    review.classification = classification;
    if (title) review.title = title;
    if (content) review.content = content;
    if (rating) review.rating = rating;
    if (characteristic_reviews) review.characteristic_reviews = characteristic_reviews;

    try {
        const savedReview = await review.save();
        let reviewResult = await Review.findById(savedReview._id);

        let result = {
            id: reviewResult._id,
            classification: reviewResult.classification,
            createdAt: reviewResult.createdAt,
            updatedAt: reviewResult.updatedAt,
            settedUsefulAccounts: [],
            usefuls: 0,
            replies: 0,
            author: {
                id: req.account._id,
                name: req.account.name,
                avatar: req.account.getAvatar()
            },
            is_setted_useful: false,
            is_blocked: false,
            can_edit: true,
            banned: reviewResult.banned,
            can_reply: reviewResult.canReply
        }

        if (reviewResult.classification !== "Instruction") {
            result.rating = reviewResult.rating;
        }
        if (reviewResult.classification !== "Quick") {
            result.title = reviewResult.title;
            result.content = reviewResult.content;
        }
        if (reviewResult.classification === "Detail") {
            result.characteristic_reviews = reviewResult.characteristic_reviews;
        }
        if (reviewResult.images.length !== 0) {
            result.images = reviewResult.images.map((image) => {
                let {url, publicId} = image;
                return {url: url, publicId: publicId};
            });
        }
        if (reviewResult.video && reviewResult.video.url != undefined) {
            result.video = {
                url: reviewResult.video.url,
                publicId: reviewResult.getVideoThumb()
            }
        }
        res.status(201).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (e) {
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }
});

module.exports = reviewsController;