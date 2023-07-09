const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const cloudinary = require("../config/cloudinaryConfig");
const {isNumber, isValidId} = require("../validations/validateData");

const Account = require("../models/account.model");
const {Review, Characteristic, Product} = require("../models/product.model");
const mongoose = require("mongoose");
const Post = require("../models/post.model");
const Report = require("../models/report.model");
const Comment = require("../models/comment.model");
const Reply = require("../models/reply.model");

const MAX_IMAGE_NUMBER = 4;
const MAX_SIZE_IMAGE = 4 * 1024 * 1024; // for 4MB
const MAX_VIDEO_NUMBER = 1;
const MAX_SIZE_VIDEO = 10 * 1024 * 1024; // for 10MB
const MAX_CHARACTER_REVIEW_CONTENT = 50000; // đánh giá tiêu chuẩn max là 200, nhưng review hướng dẫn thì max 50000 chữ cái
const MIN_CHARACTER_REVIEW_CONTENT = 50;
const MAX_CHARACTER_REVIEW_TITLE = 100;

const classificationArray =  ["Quick", "Standard", "Detail", "Instruction"];

const reviewsController = {};

// Standard, Detail, Instruction - phục vụ detail review container
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
            is_setted_useful: review.settedUsefulAccounts.map(x => x._id).includes(req.account._id),
            is_blocked: isBlocked,
            can_edit: req.account._id.equals(review.userReview_id._id) ? (review.banned ? false : true) : false,
            banned: review.banned,
            can_reply: review.canReply
        };

        if (review.classification != "Instruction") {
            result.rating = review.rating;
        }

        if (review.classification == "Detail") {
            let characteristic_reviews_result = [];
            for (let characteristic_review of review["characteristic_reviews"]) {
                let characteristic = await Characteristic.findOne({_id: characteristic_review["characteristic_id"]});
                characteristic_reviews_result.push({
                    characteristic_id: characteristic._id,
                    criteria: characteristic.criteria,
                    point: characteristic_review["point"]
                })
            }
            result.characteristic_reviews = characteristic_reviews_result;
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

// Standard & Detail - do instruction ở UI riêng
reviewsController.get_list_reviews = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;
    var {index, count, last_id} = req.query; // đang set là 10 ở frontend
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

// chỉ đơn thuần là thống kê sao, không cập nhật vào đâu cả
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

// Mỗi 1 người chỉ được đánh giá Quick hoặc Standard hoặc Detail 1 lần với 1 sản phẩm. Instruction thì vô số
// 1 user chỉ được đánh giá 1 sản phẩm 1 lần (Quick/Standard/Detail 1 lần: Quick được chuyển sang Standard được chuyển sang Detail, Instruction vô hạn)
// add and update. Add: Quick - Standard - Detail - Instruction. Update: Quick - Standard - Detail
reviewsController.add_review = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;
    let {classification, characteristic_reviews, rating, title, content } = req.body;

    // console.log(typeof characteristic_reviews);

    // send bằng app, cần chuyển từ JSON string sang JSON object
    if (typeof characteristic_reviews === 'string') {
        var temp = JSON.parse(characteristic_reviews);
        characteristic_reviews = temp;
    }
    // send bằng post man
    if (typeof characteristic_reviews === 'object') {

    }

    // console.log(typeof characteristic_reviews);

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
            review.images = data;
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
            review.video = data;
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

    let savedReview;

    // cập nhật lại review
    try {
        if (review.classification !== "Instruction") {
            const existedReview = await Review.findOne({
                product_id: product_id,
                userReview_id: req.account._id,
                classification: {$in: ["Quick", "Standard", "Detail"]}
            });
            if (existedReview == null) {
                try {
                    savedReview = await review.save();
                } catch (e) {
                    return setAndSendResponse(res, responseError.PROBLEM_WITH_EXISTED_REVIEWED);
                }
            } else {
                if (existedReview.classification === "Detail") {
                    // nếu gửi lên là Quick, Standard, Detail thì giữ nguyên classification là Detail
                    if (title) existedReview.title = review.title;
                    if (content) existedReview.content = review.content;
                    existedReview.rating = review.rating;
                    if (characteristic_reviews) existedReview.characteristic_reviews = review.characteristic_reviews;
                    savedReview = await existedReview.save();
                }

                if (existedReview.classification === "Quick") {
                    // nếu gửi lên là Quick, Standard, Detail thì nâng lên classification của chính cái gửi lên
                    existedReview.classification = review.classification;
                    if (title) existedReview.title = review.title;
                    if (content) existedReview.content = review.content;
                    existedReview.rating = review.rating;
                    if (characteristic_reviews) existedReview.characteristic_reviews = review.characteristic_reviews;
                    savedReview = await existedReview.save();
                }

                if (existedReview.classification === "Standard") {
                    if (classification === "Detail") existedReview.classification = review.classification; // nâng lên, còn không thì giữ nguyên là Standard
                    if (title) existedReview.title = review.title;
                    if (content) existedReview.content = review.content;
                    existedReview.rating = review.rating;
                    if (characteristic_reviews) existedReview.characteristic_reviews = review.characteristic_reviews;
                    savedReview = await existedReview.save();
                }
            }
        }

        if (review.classification === "Instruction") {
            savedReview = await review.save();
        }

        // bắt đầu trả về kết quả cuối cùng
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
            can_edit: true, // cần sửa lại theo post, vì có thể bị banned là không edit được (add thì true, nhưng khi update edit mà đang bị block rồi thì phải là false)
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
            let characteristic_review_results = [];
            for (let characteristic_review of reviewResult["characteristic_reviews"]) {
                let characteristic = await Characteristic.findOne({_id: characteristic_review["characteristic_id"]});
                characteristic_review_results.push({
                    characteristic_id: characteristic._id,
                    criteria: characteristic.criteria,
                    point: characteristic_review["point"]
                })
                result.characteristic_reviews = characteristic_review_results;
            }
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
        console.log(e);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }

});

// Quick, Standard, Detail - phục vụ để update lại review: bao gồm rating, title, content, characteristic_reviews. Instruction không cần retrieve.
// - Bởi vì ấn vào FAB không có dữ liệu được chuyển tiếp
reviewsController.retrieve_review = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;

    if (!product_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(product_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        const review = await Review.findOne({product_id: product_id, userReview_id: req.account._id, classification: { $in: ["Quick", "Standard", "Detail"] } });

        if (review == null) {
            return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        }

        if (review.banned) {
            return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);
        }


        // Quyết định giữ nguyên trường is_blocked để biết đâu có thể tái sử dụng model, và cho giống với get_list_reviews
        let result = {
            id: review._id,
            classification: review.classification,
            rating : review.rating
        };

        if (review.classification != "Quick") {
            result.title = review.title;
            result.content = review.content;
        }

        if (review.classification == "Detail") {
            let characteristic_reviews_result = [];
            for (let characteristic_review of review["characteristic_reviews"]) {
                let characteristic = await Characteristic.findOne({_id: characteristic_review["characteristic_id"]});
                characteristic_reviews_result.push({
                    characteristic_id: characteristic._id,
                    criteria: characteristic.criteria,
                    point: characteristic_review["point"]
                })
            }
            result.characteristic_reviews = characteristic_reviews_result;
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

// Update Instruction
reviewsController.edit_instruction_review = expressAsyncHandler(async  (req, res) => {
    const {id, title, content} = req.body;

    if (!id ||!title || !content) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    try {
        const updateReview = await Review.findOneAndUpdate(
            {_id: id, userReview_id: req.account._id, classification: "Instruction"},
            { title: title, content: content},
            { new: true }
        );

        if (updateReview == null) {
            return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        }

        let result = {
            id: updateReview._id,
            classification: updateReview.classification,
            rating : updateReview.rating,
            title : updateReview.title,
            content : updateReview.content,
            createdAt: updateReview.createdAt,
            updatedAt: updateReview.updatedAt,
            usefuls: updateReview.usefuls,
            replies: updateReview.replies,
            author: {
                id: req.account._id,
                name: req.account.name,
                avatar: req.account.getAvatar()
            },
            is_setted_useful: updateReview.settedUsefulAccounts.includes(req.account._id),
            is_blocked: false,
            can_edit: true,
            banned: updateReview.banned,
            can_reply: updateReview.canReply
        };

        if (updateReview.images.length !== 0) {
            result.images = updateReview.images.map((image) => {
                let {url, publicId} = image;
                return {url: url, publicId: publicId};
            });
        }
        if (updateReview.video && updateReview.video.url != undefined) {
            result.video = {
                url: updateReview.video.url,
                publicId: updateReview.video.publicId
            }
        }

        res.status(201).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (error) {
        console.log(error)
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }


});

reviewsController.report_review = expressAsyncHandler(async (req, res) => {
    const {id, subject, details} = req.body;
    const account = req.account;

    if (!id || !subject || !details) setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(id)) setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    const subjectArray = ['Spam', 'Thông tin sai sự thật', 'Bán hàng trái phép', 'Nội dung không phù hợp', 'Bình luận gây rối', 'Bình luận xúc phạm', 'Review chưa đúng sự thật, thiếu khách quan'];

    if (subject && !subjectArray.includes(subject)) {
        // console.log("subject ko nằm trong dãy các subject mặc định");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID)
    }

    //Check user being blocked or not
    if (account.isBlocked) setAndSendResponse(res, responseError.NOT_ACCESS);

    //Get review
    const review = await Review.findById(id);
    if (review == null) setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);

    // bài viết bị khóa
    if (review.banned) {
        // console.log("bài viết bị khóa");
        return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);
    }

    //Reporter and post'author is same person
    if (account._id.toString() === review.userReview_id.toString()) setAndSendResponse(res, responseError.UNKNOWN_ERROR);

    let detailsModify = "";
    if (details == subject) {
        switch (subject) {
            case 'Spam':
                detailsModify = "Nội dung được coi là spam khi chứa thông tin không mong muốn hoặc không liên quan, thường gây phiền toái cho người nhận.";
                break;
            case 'Thông tin sai sự thật':
                detailsModify = "Nội dung chứa thông tin không chính xác hoặc thiếu sự xác thực, có thể gây hiểu nhầm hoặc lan truyền thông tin sai lệch.";
                break;
            case 'Bán hàng trái phép':
                detailsModify = "Nội dung liên quan đến việc quảng cáo hoặc bán hàng trái phép, vi phạm các quy định và quy tắc của nền tảng.";
                break;
            case 'Nội dung không phù hợp':
                detailsModify = "Nội dung không phù hợp là những thông tin, hình ảnh hoặc bình luận vi phạm các quy tắc xã hội và ngữ nghĩa về tôn trọng, lịch sự và đạo đức.";
                break;
            case 'Bình luận gây rối':
                detailsModify = "Bình luận gây rối là những ý kiến, lời nhắn hoặc bài viết nhằm gây khó chịu, xao lạc hoặc gây rối trong một cộng đồng hoặc cuộc trò chuyện.";
                break;
            case 'Bình luận xúc phạm':
                detailsModify = "Bình luận xúc phạm là những lời nhận xét, phê phán hoặc chỉ trích một người hoặc một nhóm người một cách không tôn trọng hoặc gây tổn thương.";
                break;
            case 'Review chưa đúng sự thật, thiếu khách quan':
                detailsModify = "Review chưa đúng sự thật, thiếu khách quan là những đánh giá, nhận xét hoặc đánh giá sản phẩm, dịch vụ mà không tuân thủ các tiêu chí chính xác và khách quan.";
                break;
            default:
                detailsModify = "Mô tả không xác định cho chủ đề này.";
        }
    }

    const newReport = await new Report({
        reporter_id: account._id,
        review_id: id,
        subject: subject,
        details: details != subject ? details : detailsModify,
        status: "Đang giải quyết"
    }).save();
    review.reports_review.push(newReport._id);
    await review.save();

    setAndSendResponse(res, responseError.OK);
    // res.send(account._id)
});

// merge 2 cái report và auto-bot + admin banned
reviewsController.get_list_deleted_banned_reviews = expressAsyncHandler(async (req, res) => {
    try {
        const reviews = await Review
            .find({userReview_id: req.account._id, classification: { $in: ["Standard", "Detail", "Instruction"] }, banned: true})
            .populate({ path: 'product_id', model: 'Product' })
            .sort("-createdAt");

        // tự động khóa không cần người khác report
        const reviewsResult = reviews.map((r) => {
            return {
                subject: "Bị khóa do Bot/Admin",
                details: "Bị khóa do Bot/Admin",
                review_id: r._id,
                classification: r.classification,
                productImage: r.product_id.images[0].url,
                productName: r.product_id.name,
                account_id: r.account_id,
                rating: r.rating != undefined ? r.rating : null,
                title: r.title,
                content: r.content
            }
        });

        // nếu là khóa do report thì set lại subject và details
        for (let r of reviewsResult) {
            let report = await Report.findOne({review_id: r.review_id});
            if (report != null) {
                r.subject = report.subject,
                r.details = report.details
            }
        }

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: reviewsResult
        })

    } catch (e) {

    }
})

reviewsController.setted_useful_review = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let review = await Review.findById(id);
        if (review == null) {
            return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        }

        if (review.banned) {
            return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);
        }

        let author = await Account.findOne({_id: review.userReview_id}).exec();
        if (author == null) setAndSendResponse(res, responseError.NO_DATA);
        let user = req.account;

        var isBlocked = false;
        if (author?.blockedAccounts.length != 0) {
            isBlocked = author?.blockedAccounts.findIndex((element) => {
                return element.account.toString() === user._id.toString();
            }) !== -1;
        }

        if (!isBlocked) {
            if (user?.blockedAccounts.length != 0) {
                isBlocked = user?.blockedAccounts?.findIndex((element) => {
                    return element.account.toString() === author._id.toString();
                }) !== -1;
            }
        }
        if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người review đã chặn bạn / Bạn chặn người review, do đó không thể set useful bài review');

        if (
            review?.settedUsefulAccounts.findIndex((element) => {
                return element.equals(user._id);
            }) != -1
        )
            return setAndSendResponse(res, responseError.HAS_BEEN_SETTED_USEFUL);
        else {
            await Review.findOneAndUpdate(
                {_id: id},
                {
                    $push: {settedUsefulAccounts: {_id: user._id}}
                }
            );

            var updatedReview = await Review.findOneAndUpdate(
                {_id: id},
                {$inc: {usefuls: 1}},
                { new: true }
            );

            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    usefuls: updatedReview.usefuls
                }
            });
        }
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

reviewsController.unsetted_useful_review = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let review = await Review.findById(id);
        if (review == null) {
            return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        }

        if (review.banned) {
            return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);
        }

        let author = await Account.findOne({_id: review.userReview_id}).exec();
        if (author == null) setAndSendResponse(res, responseError.NO_DATA);
        let user = req.account;

        // chỗ này kiểm tra cả block, khác với unlike post
        var isBlocked = false;
        if (author?.blockedAccounts.length != 0) {
            isBlocked = author?.blockedAccounts.findIndex((element) => {
                return element.account.toString() === user._id.toString();
            }) !== -1;
        }

        if (!isBlocked) {
            if (user?.blockedAccounts.length != 0) {
                isBlocked = user?.blockedAccounts?.findIndex((element) => {
                    return element.account.toString() === author._id.toString();
                }) !== -1;
            }
        }
        if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người review đã chặn bạn / Bạn chặn người review, do đó không thể set un useful bài review');

        if (
            review?.settedUsefulAccounts.findIndex((element) => {
                return element.equals(user._id);
            }) == -1
        )
            return setAndSendResponse(res, responseError.HAS_NOT_BEEN_SETTED_USEFUL);
        else {
            await Review.findOneAndUpdate(
                {_id: id},
                {
                    // $pull: {settedUsefulAccounts: {_id: user._id}} // không được, ảo ma
                    $pull: {settedUsefulAccounts: user._id}
                }
            );

            var updatedReview = await Review.findOneAndUpdate(
                {_id: id},
                {$inc: {usefuls: -1}},
                { new: true }
            );

            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    usefuls: updatedReview.usefuls
                }
            });
        }
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

reviewsController.delete_review = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;

    if (id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    let review;
    try {
        review = await Review.findById(id);
    } catch (err) {
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

    if (!review) {
        return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
    }

    if (review.banned) {
        return setAndSendResponse(res, responseError.REVIEW_IS_BANNED);
    }

    if (!review.userReview_id.equals(req.account._id)) {
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }

    try {
        await Review.findByIdAndDelete(id);

        try {
            if (review.images.length > 0) {
                for (let image of review.images) {
                    cloudinary.removeImg(image.publicId);
                }
            }
            if (review.video && review.video.publicId) cloudinary.removeVideo(review.video.publicId);
        } catch (error) {
            return setAndSendResponse(res, responseError.EXCEPTION_ERROR);
        }
        // xóa reply
        Reply.deleteMany({review_id: review._id});

        setAndSendResponse(res, responseError.OK);
    } catch (error) {
        // console.log(error);
        setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }
});


module.exports = reviewsController;