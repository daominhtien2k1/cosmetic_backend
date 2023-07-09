const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const {Carousel, Product, Brand, Review, Characteristic} = require('../models/product.model');

const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const cloudinary = require("../config/cloudinaryConfig");
const {isValidId} = require("../validations/validateData");
const mongoose = require("mongoose");
const Post = require("../models/post.model");
const MAX_SIZE_IMAGE = 4 * 1024 * 1024;

const productsController = {};
productsController.get_list_carousels = expressAsyncHandler(async (req, res) => {
    const carousels = await Carousel.find();
    if (carousels == null) {
        return setAndSendResponse(res, responseError.CAROUSEL_IS_NOT_EXISTED);
    }

    let result = carousels.map(carousel => {
        return {
            url: carousel.url,
            publicId: carousel.publicId
        }
    });
    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: {
            carouselList: result
        }
        // result
    });
});

productsController.add_carousel = expressAsyncHandler(async (req, res) => {
    let image;
    if (req.files) {
        image = req.files.image;
    }

    if (image === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    // if (image.buffer.bytelength > MAX_SIZE_IMAGE) {
    //     console.log("AAA");
    //     return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
    // }
    let carousel = new Carousel();
    try {
        let data = await cloudinary.uploads(image[0]);
        carousel.url = data.url;
        carousel.publicId = data.publicId;
    } catch (err) {
        //lỗi không xác định
        // console.log(err);
        return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
    }

    try {
        const savedCarousel = await carousel.save();
        res.status(201).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: savedCarousel
        });
    } catch (e) {
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }
});

productsController.get_popular_products = expressAsyncHandler(async (req, res) => {
    try {
        const limit = req.query.limit || 5; // Giới hạn số lượng sản phẩm (mặc định là 2)
        const popularProducts = await Product.find({})
            .sort({ loves: -1 }) // Sắp xếp theo số lượng yêu thích giảm dần
            .limit(parseInt(limit)); // Giới hạn số lượng sản phẩm trả về
        let result = popularProducts.map(product => {
            return {
                id: product._id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                price: product.price,
                reviews: product.reviews,
                rating: product.rating,
                loves: product.loves
            };
        });

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

productsController.get_product = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    if (id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    try {
        let product = await Product.findById(id).populate({path: 'brand_id', model: Brand});
        if (product == null) {
            return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        }

        let result = {
            id: product._id,
            name: product.name,
            origin: product.origin,
            guarantee: product.guarantee,
            expiredYear: product.expiredYear,
            description: product.description,
            available: product.available,
            lowPrice: product.lowPrice,
            highPrice: product.highPrice,
            loves: product.loves,
            isLoved: product.lovedAccounts.includes(req.account._id),
            isViewed: product.viewedAccounts.includes(req.account._id),
            brand: {
                id: product.brand_id._id,
                name:  product.brand_id.name,
                origin:  product.brand_id.origin,
                description: product.brand_id.description,
                image: product.brand_id.image
            }
        }

        if (product.images.length !== 0) {
            result.images = product.images.map((image) => {
                let {url, publicId} = image;
                return {url: url, publicId: publicId};
            });
        }

        // Lấy số lượng đánh giá của sản phẩm
        const reviewCount = await Review.countDocuments({ product_id: mongoose.Types.ObjectId(id) });

        // Lấy trung bình các rating của schema review
        const averageRating = await Review.aggregate([
            { $match: { product_id: mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' }
                }
            }
        ]);

        result.reviews = reviewCount;
        result.rating = averageRating[0] ? parseFloat(averageRating[0].average.toFixed(1)) : 0.0;

        // Không cần new: true vì không cần await trả về kết quả
        Product.findByIdAndUpdate(id, {
            reviews: reviewCount,
            rating: averageRating[0] ? parseFloat(averageRating[0].average.toFixed(1)) : 0.0
        }).exec();

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }


});

productsController.get_relate_products = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;
    if (product_id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(product_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    try {
        // Lấy thông tin sản phẩm liên quan
        const relateProducts = await Product.findById(product_id)
            .select('relateProductList')
            .populate({
                path: 'relateProductList',
                model: Product,
                select: 'brand_id name images reviews rating loves',
                populate: { path: 'brand_id', model: Brand, select: 'name' }
            })
            .exec();

        // Tạo một mảng kết quả chỉ với thông tin cần thiết
        const result = relateProducts.relateProductList.map(product => ({
            id: product._id,
            brand_name: product.brand_id.name,
            name: product.name,
            image: product.images[0],
            reviews: product.reviews,
            rating: product.rating,
            loves: product.loves
        }));

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

productsController.get_list_characteristics = expressAsyncHandler(async (req, res) => {
    const {product_id} = req.query;
    if (product_id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(product_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    try {
        const characteristics = await Characteristic.find({product_id: product_id}).select("criteria");

        const characteristic_reviews = characteristics.map((c) => ({
            characteristic_id:  c._id,
            criteria: c.criteria
        }));

        const result = {
            characteristic_reviews: characteristic_reviews
        };

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

productsController.get_loved_products = expressAsyncHandler(async (req, res) => {
    try {
        const lovedProducts = await Product.find(
            {
                loves: {$gt: 0},
                lovedAccounts: req.account._id
            }
        );

        const result = lovedProducts.map(lp => {
            return {
                id: lp._id,
                slug: lp.slug,
                name: lp.name,
                image: lp.images[0],
                reviews: lp.reviews,
                rating: lp.rating,
                loves: lp.loves,
                isLoved: lp.lovedAccounts.includes(req.account._id)
            };
        });

        return res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (err) {
        console.log(err)
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }

});

productsController.get_viewed_products = expressAsyncHandler(async (req, res) => {
    try {
        const viewedProducts = await Product.find(
            {
                viewedAccounts: req.account._id
            }
        );

        const result = viewedProducts.map(vp => {
            return {
                id: vp._id,
                slug: vp.slug,
                name: vp.name,
                image: vp.images[0],
                reviews: vp.reviews,
                rating: vp.rating,
                loves: vp.loves,
                isViewed: vp.viewedAccounts.includes(req.account._id)
            };
        });

        return res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (err) {
        console.log(err)
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }

});

productsController.love_product = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try  {
        let product = await Product.findById(id);
        if (product == null) {
            return setAndSendResponse(res, responseError.PRODUCT_IS_NOT_EXISTED);
        }

        if (
            product?.lovedAccounts.findIndex((element) => {
                return element.equals(req.account._id);
            }) != -1
        )
            return setAndSendResponse(res, responseError.HAS_BEEN_LOVED);

        var updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            {$push: {lovedAccounts: {_id: req.account._id}}, $inc: {loves: 1}},
            { new: true }
        );
        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: {
                loves: updatedProduct.loves
            }
        });
    } catch (err) {

    }
});

productsController.unlove_product = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let product = await Product.findById(id);
        if (!product) {
            return setAndSendResponse(res, responseError.PRODUCT_IS_NOT_EXISTED);
        }

        const isLoved = product.lovedAccounts.includes(req.account._id);
        if (!isLoved) {
            return setAndSendResponse(res, responseError.HAS_NOT_BEEN_LOVED);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $pull: { lovedAccounts: req.account._id }, $inc: { loves: -1 } },
            { new: true }
        );

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: {
                loves: updatedProduct.loves
            }
        });
    } catch (error) {
        console.error(error);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

productsController.view_product = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let product = await Product.findById(id);
        if (!product) {
            return setAndSendResponse(res, responseError.PRODUCT_IS_NOT_EXISTED);
        }

        const isViewed = product.viewedAccounts.includes(req.account._id);
        if (isViewed) {
            return setAndSendResponse(res, responseError.HAS_BEEN_VIEWED);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $push: { viewedAccounts: req.account._id } },
            { new: true }
        );

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: updatedProduct
        });
    } catch (error) {
        console.error(error);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

module.exports = productsController;