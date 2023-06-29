const express = require("express");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const {responseError, setAndSendResponse, callRes} = require('../constants/response_code');
const {Category, Brand, Product, Characteristic} = require("../models/product.model");

const adminController = {}

adminController.fetch_products = expressAsyncHandler(async (req, res) => {
    try {
        const products = await Product.find()
            .populate({path: 'category_id', model: Category})
            .populate({path: 'brand_id', model: Brand})
        ; // Truy vấn tất cả sản phẩm từ database
        const formattedProducts = await Promise.all(products.map(async (product) => {
            const characteristicsData = await Characteristic.find({product_id: product._id}).select("criteria");

            const characteristics = characteristicsData.map((c) => c.criteria);

            return {
                _id: product._id,
                slug: product.slug,
                name: product.name,
                origin: product.origin,
                guarantee: product.guarantee,
                expiredYear: product.expiredYear,
                description: product.description,
                category: product.category_id.name, // Tùy theo yêu cầu, có thể sử dụng populate() để lấy thông tin chi tiết từ collection categories
                brand: product.brand_id.name, // Tùy theo yêu cầu, có thể sử dụng populate() để lấy thông tin chi tiết từ collection brands
                images: product.images.map((image) => image.url).join('&&'),
                lowPrice: product.lowPrice,
                highPrice: product.highPrice,
                available: product.available ? 'Khả dụng' : 'Không khả dụng',
                type: product.type,
                gender: product.gender.join('&&'),
                skin: product.skin.join('&&'),
                characteristics: characteristics.join('&&'),
            };
        }));

        res.json(formattedProducts); // Trả về dữ liệu dạng JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.update_product = expressAsyncHandler(async  (req, res) => {
    try {
        const productId = req.params.id;
        const { name, origin, description, category, brand, images, lowPrice, highPrice, available, type, gender, skin, characteristics } = req.body;

        const category_id = await Category.findOne({name: category})._id;
        const brand_id = await Brand.findOne({name: brand})._id;

        // Chuyển các trường từ string thành mảng
        let imagesArray, genderArray, skinArray, characteristicsArray;

        if (images) {
            imagesArray = images.split('&&').map(url => {
                return {filename: '', url: url, publicId: ''};
            });
        }
        if (gender) {
            genderArray = gender.split('&&').map(item => item.trim());
        }
        if (skin) {
            skinArray = skin.split('&&').map(item => item.trim());
        }
        if (characteristics) {
            characteristicsArray = characteristics.split('&&').map(item => item.trim());
            // khi đã có dữ liệu người dùng, edit là mất hết
            await Characteristic.remove({product_id: productId});
            for (criteria of characteristicsArray) {
                await new Characteristic({criteria: criteria, product_id: productId}).save();
            }
        }


        const updateData = {};
        if (name) {
            updateData.name = name;
        }
        if (origin) {
            updateData.origin = origin;
        }
        if (description) {
            updateData.description = description;
        }
        if (category) {
            updateData.category_id = category_id;
        }
        if (brand) {
            updateData.brand_id = brand_id;
        }
        if (images) {
            updateData.images = imagesArray;
        }
        if (lowPrice) {
            updateData.lowPrice = lowPrice;
        }
        if (highPrice) {
            updateData.highPrice = highPrice;
        }
        if (available) {
            updateData.available = available;
        }
        if (type) {
            updateData.type = type;
        }
        if (gender) {
            updateData.gender = genderArray;
        }
        if (skin) {
            updateData.skin = skinArray;
        }
        // console.log(updateData);
        const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: updateData }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

adminController.delete_product = expressAsyncHandler(async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Characteristic.remove({product_id: productId});
        await Product.findByIdAndDelete(productId);

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.create_product = expressAsyncHandler(async (req, res) => {
    try {
        const {slug, name, origin, guarantee, expiredYear, description, category, brand, images, lowPrice, highPrice, available, type, gender, skin, characteristics} = req.body;

        if(!slug || !name || !origin || !guarantee || !expiredYear || !description || !category || !brand || !images || !lowPrice || !highPrice) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }
        // Tìm brand_id và category_id dựa trên tên brand và category
        const brandObj = await Brand.findOne({ name: brand });
        const categoryObj = await Category.findOne({ name: category });

        if (!brandObj) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        if (!categoryObj) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Chuyển các trường từ string thành mảng
        let imagesArray, genderArray, skinArray, characteristicsArray;
        if (images) {
            imagesArray = images.split('&&').map(url => {
                return { filename: '', url: url, publicId: '' };
            });
        }
        if (gender) {
            genderArray = gender.split('&&').map(item => item.trim());
        }
        if (skin) {
            skinArray = skin.split('&&').map(item => item.trim());
        }

        const newProduct = await Product.create({
            slug,
            name,
            origin,
            guarantee,
            expiredYear,
            description,
            category_id: categoryObj._id,
            brand_id: brandObj._id,
            images: imagesArray,
            lowPrice,
            highPrice,
            available,
            type,
            gender: genderArray,
            skin: skinArray,
            characteristics: characteristicsArray
        });

        if (characteristics) {
            characteristicsArray = characteristics.split('&&').map(item => item.trim());
            for (criteria of characteristicsArray) {
                await new Characteristic({criteria: criteria, product_id: newProduct._id}).save();
            }
        }

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = adminController;