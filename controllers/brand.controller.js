const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const {Brand, Product} = require('../models/product.model');
const {setAndSendResponse, responseError} = require("../constants/response_code");
const {isValidId} = require("../validations/validateData");

const brandsController = {}

brandsController.get_brand = expressAsyncHandler(async (req,res) => {
    const id = req.params.id;
    if (id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    try {
        let brand = await Brand.findById(id);

        let productList = await Product.find({brand_id: id}).select("id slug name images reviews rating loves");

        let productListResult = productList.map(product => {
            return {
                id: product._id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                reviews: product.reviews,
                rating: product.rating,
                loves: product.loves
            };
        });

        let productsResult = await Product.countDocuments({brand_id: id});
        await Brand.findByIdAndUpdate(id, { products: productsResult });

        await Product.aggregate([
            { $match: { brand_id: mongoose.Types.ObjectId(id) } },
            { $group: { _id: null, average: { $avg: '$rating' } } }
        ])
            .then((results) => {
                if (results.length > 0) {
                    const {average} = results[0];
                    // Brand.findByIdAndUpdate(id, { rating: average }); // không cập nhật csdl
                    // await Brand.findByIdAndUpdate(id, { rating: average }); // chạy được, thêm async vào body
                    Brand.findByIdAndUpdate(id, { rating: average }).exec(); // chạy được
                    // return Brand.findByIdAndUpdate(id, { rating: average }); // chạy được
                }
            });

    /*
        1. Brand.findByIdAndUpdate(id, { rating: average });: Dòng này sẽ không chạy được vì nó chỉ là một câu lệnh gọi hàm mà không có xử lý tiếp theo.
        Khi gọi hàm này, truy vấn sẽ được tạo ra nhưng không được thực thi, do đó cập nhật không xảy ra.

        2. await Brand.findByIdAndUpdate(id, { rating: average });: Dòng này chạy được khi bạn thêm từ khóa async vào khai báo của hàm xung quanh đoạn mã này.
        Bằng cách sử dụng await, mã sẽ đợi cho đến khi câu lệnh cập nhật hoàn thành trước khi tiếp tục thực hiện các dòng mã tiếp theo.

        3. Brand.findByIdAndUpdate(id, { rating: average }).exec();: Dòng này chạy được vì chúng ta sử dụng .exec() để thực thi câu truy vấn và trả về một Promise.
        Bằng cách sử dụng .exec(), chúng ta có thể sử dụng .then() hoặc await để xử lý kết quả truy vấn.

        4. return Brand.findByIdAndUpdate(id, { rating: average });: Dòng này cũng chạy được vì chúng ta trả về một Promise từ câu lệnh .findByIdAndUpdate().
        Bằng cách trả về Promise, chúng ta có thể sử dụng .then() hoặc await trong ngữ cảnh khác để xử lý kết quả truy vấn.

        Vì vậy, chỉ dòng đầu tiên không chạy được vì nó không có xử lý tiếp theo, trong khi ba dòng sau đều có cách xử lý kết quả truy vấn hoặc đợi câu lệnh cập nhật hoàn thành.

     */

        // chạy được
        // const results = await Product.aggregate([
        //     { $match: { brand_id: mongoose.Types.ObjectId(id) } },
        //     { $group: { _id: null, average: { $avg: '$rating' } } }
        // ]);
        //
        // if (results.length > 0) {
        //     const { average } = results[0];
        //     console.log(average);
        //     await Brand.findByIdAndUpdate(id, { rating: average });
        // }


        await Product.aggregate([
            { $match: { brand_id: mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: '$reviews' }
                }
            }
        ])
            .then((results) => {
                if (results.length > 0) {
                    const {totalReviews} = results[0];
                    Brand.findByIdAndUpdate(id, { reviews: totalReviews }).exec();
                }
            });

        const newBrand = await Brand.findById(id);

        let result = {
            id: newBrand._id,
            name: newBrand.name,
            slug: newBrand.slug,
            origin: newBrand.origin,
            description: newBrand.description,
            image: newBrand.image,
            products: newBrand.products,
            followers: newBrand.followers,
            reviews: newBrand.reviews,
            rating: newBrand.rating,
            productList: productListResult,
            is_followed: newBrand.followedAccounts.includes(req.account._id)
        }

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

brandsController.follow_brand = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try  {
        let brand = await Brand.findById(id);

        if (
            brand?.followedAccounts.findIndex((element) => {
                return element.equals(req.account._id);
            }) != -1
        )
            return setAndSendResponse(res, responseError.HAS_BEEN_FOLLOWED);

        var updatedBrand = await Brand.findOneAndUpdate(
            {_id: id},
            {$push: {followedAccounts: {_id: req.account._id}}, $inc: {followers: 1}},
            { new: true }
        );
        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: {
                followers: updatedBrand.followers
            }
        });
    } catch (err) {

    }
});

brandsController.unfollow_brand = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let brand = await Brand.findById(id);

        const isFollowed = brand.followedAccounts.includes(req.account._id);
        if (!isFollowed) {
            return setAndSendResponse(res, responseError.HAS_NOT_BEEN_FOLLOWED);
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            { $pull: { followedAccounts: req.account._id }, $inc: { followers: -1 } },
            { new: true }
        );

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: {
                followers: updatedBrand.followers
            }
        });
    } catch (error) {
        console.error(error);
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

brandsController.get_followed_brands = expressAsyncHandler(async (req, res) => {
    const brands = await Brand.find();
    if (brands.length < 1) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let resultMustFilter = brands.map(brand => {
        return {
            id: brand._id,
            slug: brand.slug,
            name: brand.name,
            image: brand.image.url,
            is_followed: brand.followedAccounts.includes(req.account._id)
        }
    });

    let result = resultMustFilter.filter((b) => b.is_followed == true);

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
    });

});

brandsController.get_list_brands = expressAsyncHandler(async (req,res) => {
    try {
        const brands = await Brand.find({}, '_id name image').lean(); // không có lean ảo ma lắm

        const formattedBrands = brands.map((brand) => ({
            ...brand,
            image: brand.image.url
        }));

        res.json(formattedBrands);
    } catch (error) {
        console.error('Failed to fetch brands', error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
});


module.exports = brandsController;
