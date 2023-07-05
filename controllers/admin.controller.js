const express = require("express");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const {responseError, setAndSendResponse, callRes} = require('../constants/response_code');
const {Category, Brand, Product, Characteristic, Review} = require("../models/product.model");
const Account = require("../models/account.model");
const Event = require("../models/event.model");
const Post = require("../models/post.model");
const Report = require("../models/report.model");

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

        if(!productId) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        const { name, origin, description, category, brand, images, lowPrice, highPrice, available, type, gender, skin, characteristics } = req.body;

        const category_id = await Category.findOne({name: category})._id;
        const brand_id = await Brand.findOne({name: brand})._id;

        // Chuyển các trường từ string thành mảng
        let imagesArray, availableValue, genderArray, skinArray, characteristicsArray;

        if (images) {
            imagesArray = images.split('&&').map(url => {
                return {filename: '', url: url, publicId: ''};
            });
        }
        if (available) {
            availableValue = (available == "Khả dụng" ? true : false);
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
            updateData.available = availableValue;
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
        // dù nhận từ là String nhưng khi cập nhật dữ liệu tự động vẫn có thể là giá trị boolean (tự nhận dạng Boolean string)
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

////////////////////////////////////////////////////////////////////////////////////////////////
adminController.fetch_accounts = expressAsyncHandler(async (req, res) => {
    try {
        const accounts = await Account.find({}, '_id name password phoneNumber avatar gender isBlocked description city country skin point level isBrand brandId')
            .lean()
            .exec();

        // Chuyển đổi giá trị isBlocked thành chuỗi "Bị khóa" hoặc "Hoạt động"
        const formattedAccounts = accounts.map(({ skin, ...restProp }) => ({
            ...restProp,
            avatar: restProp.avatar?.url,
            isBlocked: restProp.isBlocked ? 'Bị khóa' : 'Hoạt động',
            skinType: skin.type,
            skinIsSensitive: skin.obstacle.isSensitive ? 'Nhạy cảm': 'Không nhạy cảm',
            hasAcne: skin.obstacle.hasAcne ? 'Có mụn' : 'Không có mụn',
            isBrand: restProp.isBrand ? 'Nhãn hàng' : 'Tài khoản thường',
            brandId: restProp.brandId ? restProp.brandId : null
        }));

        res.json(formattedAccounts);
    } catch (error) {
        console.error('Failed to fetch accounts', error);
        res.status(500).json({ error: 'Failed to fetch accounts' });
    }
});

adminController.update_account = expressAsyncHandler(async (req, res) => {
    try {
        const accountId = req.params.id;

        if(!accountId) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        const { password, isBlocked, isBrand, brandId } = req.body;

        // thiếu hết
        if (!password && !isBlocked && !isBrand && !brandId) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        // Chuyển đổi giá trị isBlocked từ chuỗi thành boolean
        const blockedValue = isBlocked === 'Bị khóa';

        // Chuyển đổi giá trị isBrand từ chuỗi thành boolean
        const brandValue = isBrand === 'Nhãn hàng';

        const updateData = {};

        if (typeof password !== 'undefined') {
            updateData.password = password;
        }

        if (typeof isBlocked !== 'undefined') {
            updateData.isBlocked = blockedValue;
        }

        if (typeof isBrand !== 'undefined') {
            updateData.isBrand = brandValue;
        }

        if (typeof brandId !== 'undefined' && brandId !== '' && isBrand === 'Nhãn hàng') {
            updateData.brandId = brandId;
        } else if (brandId === '' && isBrand === 'Tài khoản thường') {
            updateData.brandId = null;
        }

        const updatedAccount = await Account.findByIdAndUpdate(accountId, { $set: updateData }, { new: true });
        if (!updatedAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.json(updatedAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.delete_account = expressAsyncHandler(async (req, res) => {
    try {
        const accountId = req.params.id;

        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        await Account.findByIdAndDelete(accountId);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.create_account = expressAsyncHandler(async (req, res) => {
    try {
        const { name, phoneNumber, password, avatar, gender, description, city, country, isBrand, brandId } = req.body;

        if (!phoneNumber || !password) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        // Chuyển đổi trường avatar thành đối tượng
        const avatarObject = {
            filename: '',
            url: avatar,
            publicId: '',
        };

        // Tạo tài khoản mới
        const newAccount = await Account.create({
            name,
            phoneNumber,
            password,
            avatar: avatarObject,
            gender,
            description,
            city,
            country,
            isBrand: isBrand === 'Nhãn hàng',
            brandId,
        });

        res.status(201).json(newAccount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
adminController.fetch_categories = expressAsyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({}, '_id slug name description')
            .lean()
            .exec();

        res.json(categories);
    } catch (error) {
        console.error('Failed to fetch categories', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

adminController.update_category = expressAsyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id;

        if (!categoryId) {
            return res.status(400).json({ message: 'Missing category ID' });
        }

        const { slug, name, description } = req.body;

        const updateData = {};

        if (slug) {
            updateData.slug = slug;
        }

        if (name) {
            updateData.name = name;
        }

        if (description) {
            updateData.description = description;
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.delete_category = expressAsyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        await Category.findByIdAndDelete(categoryId);

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.create_category = expressAsyncHandler(async (req, res) => {
    try {
        const { slug, name, description } = req.body;

        if (!slug || !name || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newCategory = await Category.create({
            slug,
            name,
            description,
        });

        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
adminController.fetch_brands = expressAsyncHandler(async (req, res) => {
    try {
        const brands = await Brand.find({}, '_id slug name origin description image')
            .lean()
            .exec();

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

adminController.update_brand = expressAsyncHandler(async (req, res) => {
    try {
        const brandId = req.params.id;

        if(!brandId) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        const { slug, name, origin, description, image } = req.body;

        const updateData = {};

        if (typeof slug !== 'undefined') {
            updateData.slug = slug;
        }

        if (typeof name !== 'undefined') {
            updateData.name = name;
        }

        if (typeof origin !== 'undefined') {
            updateData.origin = origin;
        }

        if (typeof description !== 'undefined') {
            updateData.description = description;
        }

        if (typeof image !== 'undefined') {
            updateData.image = {filename: '', url: image, publicId: ''};
        }

        const updatedBrand = await Brand.findByIdAndUpdate(brandId, { $set: updateData }, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        res.json(updatedBrand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.delete_brand = expressAsyncHandler(async (req, res) => {
    try {
        const brandId = req.params.id;

        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        await Brand.findByIdAndDelete(brandId);

        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.create_brand = expressAsyncHandler(async (req, res) => {
    try {
        const { slug, name, origin, description, image } = req.body;

        if (!slug || !name ||  !origin || !description) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        const imageObject = {filename: '', url: image, publicId: ''};

        const newBrand = await Brand.create({
            slug,
            name,
            origin,
            description,
            image: imageObject,
        });

        res.status(201).json(newBrand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
adminController.fetch_events = expressAsyncHandler(async (req, res) => {
    try {
        const events = await Event.find({}, '_id image title description startTime endTime participationCondition shortUrl')
            .lean()
            .exec();

        const formattedEvents = events.map((event) => ({
            ...event,
            image: event.image.url
        }));

        res.json(formattedEvents);
    } catch (error) {
        console.error('Failed to fetch events', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

adminController.update_event = expressAsyncHandler(async (req, res) => {
    try {
        const eventId = req.params.id;

        if (!eventId) {
            return res.status(400).json({ message: 'Missing event ID' });
        }

        const { image, title, description, startTime, endTime, participationCondition, shortUrl } = req.body;

        const updateData = {};

        if (typeof image !== 'undefined') {
            updateData.image = {filename: '', url: image, publicId: ''};
        }

        if (typeof title !== 'undefined') {
            updateData.title = title;
        }

        if (typeof description !== 'undefined') {
            updateData.description = description;
        }

        if (typeof startTime !== 'undefined') {
            updateData.startTime = startTime;
        }

        if (typeof endTime !== 'undefined') {
            updateData.endTime = endTime;
        }

        if (typeof participationCondition !== 'undefined') {
            updateData.participationCondition = participationCondition;
        }

        if (typeof shortUrl !== 'undefined') {
            updateData.shortUrl = shortUrl;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.delete_event = expressAsyncHandler(async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.create_event = expressAsyncHandler(async (req, res) => {
    try {
        const { image, title, description, startTime, endTime, participationCondition, shortUrl } = req.body;

        if (!image || !title || !description || !startTime || !endTime || !participationCondition || !shortUrl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const imageObject = {filename: '', url: image, publicId: ''};

        const newEvent = await Event.create({
            image: imageObject,
            title,
            description,
            startTime,
            endTime,
            participationCondition,
            shortUrl,
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
adminController.fetch_posts = expressAsyncHandler(async (req, res) => {

    try {
        const posts = await Post.find({}, '_id account_id described images video banned reports_post')
            .populate({path: 'account_id', model: Account})
            .populate({path: 'reports_post', model: Report});

        const formattedPosts = posts.map((post) => {
            // console.log(post.video); // dù không xuất hiện trong csdl nhưng in ra object {} mà không phải là undefined
            // console.log([] !== []); // true
            // console.log([] != []); // true
            // console.log({} !== {})// true
            // console.log({} != {})// true
            // console.log(post.video.toString()); // {}
            // console.log(Object.keys(post.video).length); // 3 -> ảo ma, vẫn không được
            return {
                _id: post._id,
                author: post.account_id.name,
                described: post.described,
                images: (post.images != null && post.images.length !== 0) ? post.images.map((image) => image.url).join('&&') : null,
                video: (post.video.url != undefined) ? post.video.url : null,
                banned: post.banned ? 'Bị khóa' : 'Hợp lệ',
                reports_post: (post.reports_post != null && post.reports_post.length !== 0) ? post.reports_post.map((rp) => rp.subject).join('&&'): null
                // variableTestNullUndefined: undefined // undefined thì xuất hiện trong response, còn null thì không
            }
        });

        res.json(formattedPosts); // Trả về dữ liệu dạng JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.banned_or_unbanned_post = expressAsyncHandler(async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        const post = await Post.findById(postId);

        if (!post) {
            return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        }

        post.banned = !post.banned;
        await post.save();
        return setAndSendResponse(res, responseError.OK);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////
adminController.fetch_reviews = expressAsyncHandler(async (req, res) => {

    try {
        const reviews = await Review.find({classification: { $in: ["Standard", "Detail", "Instruction"] }}, '_id classification product_id userReview_id rating title content described images video banned reports_review')
            .populate({path: 'userReview_id', model: Account})
            .populate({path: 'reports_review', model: Report});

        const formattedReviews = reviews.map((review) => {
            return {
                _id: review._id,
                classification: review.classification == 'Standard' ? 'Tiêu chuẩn' : (review.classification == 'Detail' ? 'Chi tiết': 'Hướng dẫn'),
                author: review.userReview_id.name,
                rating: review.rating != undefined ? review.rating : null,
                title: review.title,
                content: review.content,
                images: (review.images != null && review.images.length !== 0) ? review.images.map((image) => image.url).join('&&') : null,
                video: (review.video.url != undefined) ? review.video.url : null,
                banned: review.banned ? 'Bị khóa' : 'Hợp lệ',
                reports_review: (review.reports_review != null && review.reports_review.length !== 0) ? review.reports_review.map((rr) => rr.subject).join('&&'): null
            }
        });

        res.json(formattedReviews); // Trả về dữ liệu dạng JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

adminController.banned_or_unbanned_review = expressAsyncHandler(async (req, res) => {
    try {
        const reviewId = req.params.id;

        if (!reviewId) {
            return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
        }

        const review = await Review.findById(reviewId);

        if (!review) {
            return setAndSendResponse(res, responseError.REVIEW_IS_NOT_EXISTED);
        }

        review.banned = !review.banned;
        await review.save();
        return setAndSendResponse(res, responseError.OK);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = adminController;