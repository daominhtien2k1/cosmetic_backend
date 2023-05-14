const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const {Carousel} = require('../models/product.model');

const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');
const cloudinary = require("../config/cloudinaryConfig");
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

module.exports = productsController;