const express = require("express");
const expressAsyncHandler = require("express-async-handler");

//import Models
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Account = require('../models/account.model');

const {setAndSendResponse, responseError, callRes} = require('../constants/response_code');

const Report = require('../models/report.model');

const {isNumber, isValidId} = require("../validations/validateData");

//import cloud storage
const cloudinary = require('../config/cloudinaryConfig')

const MAX_IMAGE_NUMBER = 4;
const MAX_SIZE_IMAGE = 4 * 1024 * 1024; // for 4MB
const MAX_VIDEO_NUMBER = 1;
const MAX_SIZE_VIDEO = 10 * 1024 * 1024; // for 10MB
const MAX_WORD_POST = 500;
const statusArray = ['hạnh phúc', 'có phúc', 'được yêu', 'buồn', 'đáng yêu', 'biết ơn', 'hào hứng', 'đang yêu', 'điên', 'cảm kích', 'sung sướng',
    'tuyệt vời', 'ngốc nghếch', 'vui vẻ', 'tuyệt vời', 'thật phong cách', 'thú vị', 'thư giãn', 'positive', 'rùng mình',
    'đầy hi vọng', 'hân hoan', 'mệt mỏi', 'có động lực', 'proud', 'chỉ có một mình', 'chu đáo', 'OK', 'nhớ nhà', 'giận dữ',
    'ốm yếu', 'hài lòng', 'kiệt sức', 'xúc động', 'tự tin', 'rất tuyệt', 'tươi mới', 'quyết đoán', 'kiệt sức', 'bực mình',
    'vui vẻ', 'gặp may', 'đau khổ', 'buồn tẻ', 'buồn ngủ', 'tràn đầy sinh lực', 'đói', 'chuyên nghiệp', 'đau đớn', 'thanh thản',
    'thất vọng', 'lạc quan', 'lạnh', 'dễ thương', 'tuyệt cú mèo', 'thật tuyệt', 'hối tiếc', 'thật giỏi', 'lo lắng', 'vui nhộn',
    'tồi tệ', 'xuống tinh thần', 'đầy cảm hứng', 'hài lòng', 'phấn khích', 'bình tĩnh', 'bối rối', 'goofy', 'trống vắng', 'tốt',
    'mỉa mai', 'cô đơn', 'mạnh mẽ', 'lo lắng', 'đặc biệt', 'chán nản', 'vui vẻ', 'tò mò', 'ủ dột', 'được chào đón', 'gục ngã',
    'xinh đẹp', 'tuyệt vời', 'cáu', 'căng thẳng', 'thiếu', 'kích động', 'tinh quái', 'kinh ngạc', 'tức giận', 'buồn chán',
    'bối rồi', 'mạnh mẽ', 'phẫn nộ', 'mới mẻ', 'thành công', 'ngạc nhiên', 'bối rối', 'nản lòng', 'tẻ nhạt', 'xinh xắn',
    'khá hơn', 'tội lỗi', 'an toàn', 'tự do', 'hoang mang', 'già nua', 'lười biếng', 'tồi tệ hơn', 'khủng khiếp', 'thoải mái',
    'ngớ ngẩn', 'hổ thẹn', 'kinh khủng', 'đang ngủ', 'khỏe', 'nhanh nhẹn', 'ngại ngùng', 'gay go', 'kỳ lạ', 'như con người',
    'bị tổn thương', 'khủng khiếp'
];

const subjectArray = ['Ảnh khỏa thân', 'Bạo lực', 'Quấy rồi', 'Tự tử hoặc tự gây thương tích', 'Thông tin sai sự thật', 'Spam', 'Bán hàng trái phép', 'Ngôn từ gây thù ghét', 'Khủng bố'];

function countWord(str) {
    return str.split(" ").length;
}

const postsController = {};
postsController.get_post = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    // chưa tìm được cách nhập /:id mà trả về undefined
    if (id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    try {
        let post = await Post.findById(id).populate({path: 'likedAccounts', model: Account, select: ['_id', 'name', 'avatar.url', 'avatar.publicId']});
        if (post == null) {
            return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        }

        // bài viết bị khóa
        if (post.banned) {
            // console.log("bài viết bị khóa");
            return setAndSendResponse(res, responseError.POST_IS_BANNED);
        }

        let author = await Account.findOne({_id: post.account_id}).exec();

        const isBlocked = author.blockedAccounts.findIndex((element) => {
            return element.account.toString() === req.account._id.toString()
        }) !== -1;
        if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người viết đã chặn bạn, do đó không thể lấy thông tin bài viết');

        let likedAccountIDArray = post.likedAccounts.map(x => x._id);
        // console.log(likedAccountIDArray); // "mongoose": "^6.11.1", sẽ trả về false, "mongoose": "^5.12.2", sẽ trả về true
        let result = {
            id: post._id,
            described: post.described,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likedAccounts: post.likedAccounts,
            likes: post.likes,
            comments: post.comments,
            author: {
                id: author._id,
                name: author.name,
                avatar: author.getAvatar()
            },
            is_liked: likedAccountIDArray.includes(req.account._id), // "mongoose": "^6.11.1", sẽ trả về false
            status: post.status,
            is_blocked: isBlocked,
            can_edit: req.account._id.equals(author._id) ? (post.banned ? false : true) : false,
            banned: post.banned,
            can_comment: post.canComment,
            classification: post.classification,
        };
        if (post.images.length !== 0) {
            result.images = post.images.map((image) => {
                let {url, publicId} = image;
                return {url: url, publicId: publicId};
            });
        }
        if (post.video && post.video.url != undefined) {
            result.video = {
                url: post.video.url,
                publicId: post.getVideoThumb()
            }
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

postsController.get_list_posts = expressAsyncHandler(async (req, res) => {
    var {index, count, last_id} = req.query;
    // console.log(req.query)

    if (!index || !count) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    index = parseInt(index);
    count = parseInt(count);
    if (!isNumber(index) || !isNumber(count) || index < 0 || count < 1) return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        const posts = await Post.find().populate({path: 'account_id', model: Account}).sort("-createdAt");
        // console.log(posts.map(post => post._id));
        if (posts.length < 1) {
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        let index_last_id;
        if (last_id)
            index_last_id = posts.findIndex((element) => {
                return element._id == last_id
            });
        else
            index_last_id = index - 1;
        // console.log(index_last_id);
        let slicePosts = posts.slice(index_last_id + 1, index_last_id + 1 + count);
        // console.log(slicePosts)
        if (slicePosts.length < 1) {
            // console.log('No have posts');
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        let result = {
            posts: slicePosts.map(post => {
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
            new_items: (index_last_id + 1 - index),

        }
        if (slicePosts.length > 0) {
            result.last_id = slicePosts[slicePosts.length - 1]._id
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

postsController.get_list_posts_by_account_id = expressAsyncHandler(async (req, res) => {
    var account_id = req.params.account_id;
    var {index, count, last_id} = req.query;


    if (!index || !count) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    index = parseInt(index);
    count = parseInt(count);
    if (!isNumber(index) || !isNumber(count) || index < 0 || count < 1) return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        const posts = await Post.find().where('account_id').equals(account_id).populate({path: 'account_id', model: Account}).sort("-createdAt");

        if (posts.length < 1) {
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        let index_last_id;
        if (last_id)
            index_last_id = posts.findIndex((element) => {
                return element._id == last_id
            });
        else
            index_last_id = index - 1;
        // console.log(index_last_id);
        let slicePosts = posts.slice(index_last_id + 1, index_last_id + 1 + count);
        // console.log(slicePosts)
        if (slicePosts.length < 1) {
            // console.log('No have posts');
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        let result = {
            posts: slicePosts.map(post => {
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
            new_items: (index_last_id + 1 - index),

        }
        if (slicePosts.length > 0) {
            result.last_id = slicePosts[slicePosts.length - 1]._id
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


postsController.add_post = expressAsyncHandler(async (req, res) => {
    var {described, status, classification} = req.body;

    // console.log(req.body);
    let image, video;
    if (req.files) {
        image = req.files.image;
        video = req.files.video
    }

    // bắt buộc có nội dung, up mỗi ảnh không được
    if (!described) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }


    //Dữ liệu sai
    if ((described && typeof described !== "string") || (status && typeof status !== "string")) {
        // console.log("described ko phải string");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID)
    }

    if (described && countWord(described) > MAX_WORD_POST) {
        // console.log("described lớn hơn 500 kí tự");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID)
    }

    if (status && !statusArray.includes(status)) {
        // console.log("status ko nằm trong dãy các status mặc định");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID)
    }

    //có cả ảnh và video
    if (req.files && image && video) {
        // console.log("có cả ảnh và video => từ chối");
        return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
    }

    let post = new Post();

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

    post.account_id = req.account._id;
    post.described = described;
    post.status = status;
    if (classification) post.classification = classification;

    try {
        const savedPost = await post.save();
        let postResult = await Post.findById(savedPost._id).populate({path: 'likedAccounts', model: Account, select: ['_id', 'name', 'avatar.url', 'avatar.publicId']});

        let result = {
            id: postResult._id,
            described: postResult.described,
            createdAt: postResult.createdAt,
            updatedAt: postResult.updatedAt,
            likedAccounts: [],
            likes: 0,
            comments: 0,
            author: {
                id: req.account._id,
                name: req.account.name,
                avatar: req.account.getAvatar()
            },
            is_liked: false,
            status: postResult.status,
            is_blocked: false,
            can_edit: true,
            banned: postResult.banned,
            can_comment: postResult.canComment,
            classification: post.classification,
        };
        if (postResult.images.length !== 0) {
            result.images = postResult.images.map((image) => {
                let {url, publicId} = image;
                return {url: url, publicId: publicId};
            });
        }
        if (postResult.video && postResult.video.url != undefined) {
            result.video = {
                url: postResult.video.url,
                publicId: postResult.getVideoThumb()
            }
        }
        res.status(201).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    } catch (err) {
        // console.log("CAN_NOT_CONNECT_TO_DB");
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }
});

postsController.delete_post = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;

    if (id === undefined) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    let post;
    try {
        post = await Post.findById(id);
    } catch (err) {
        // console.log("Can not connect to DB");
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

    if (!post) {
        // console.log("Post is not existed");
        return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    // bài viết bị khóa
    if (post.banned) {
        // console.log("bài viết bị khóa");
        return setAndSendResponse(res, responseError.POST_IS_BANNED);
    }

    // console.log(post.account_id);
    // console.log(req.account._id);
    if (!post.account_id.equals(req.account._id)) {
        // console.log("Not Access");
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }

    try {
        await Post.findByIdAndDelete(id);

        try {
            if (post.images.length > 0) {
                for (let image of post.images) {
                    cloudinary.removeImg(image.publicId);
                }
            }
            if (post.video && post.video.publicId) cloudinary.removeVideo(post.video.publicId);
        } catch (error) {
            // console.log("Khong xoa duoc anh hoặc video");
            return setAndSendResponse(res, responseError.EXCEPTION_ERROR);
        }
        // xóa comment
        Comment.deleteMany({post_id: post._id});

        setAndSendResponse(res, responseError.OK);
    } catch (error) {
        // console.log(error);
        setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }
});

postsController.edit_post = expressAsyncHandler(async (req, res) => {
    var {id, status, image_del, described} = req.body;
    var image, video;
    if (req.files) {
        image = req.files.image;
        video = req.files.video;
    }
    var user = req.account;

    // console.log(id, status, image_del, described, user);
    if (image_del) {

        if (!Array.isArray(image_del)) {
            try {
                image_del = JSON.parse(image_del);
            } catch (err) {
                // console.log("image_del parse loi PARAMETER_TYPE_IS_INVALID");
                return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
            }
            if (!Array.isArray(image_del)) {
                // console.log("image_del PARAMETER_TYPE_IS_INVALID");
                return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
            }
        }
        for (const id_image_del of image_del) {
            if (typeof id_image_del !== "string") {
                // console.log("image_del element PARAMETER_TYPE_IS_INVALID");
                return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
            }
        }
        image_del = image_del.filter((item, i, ar) => ar.indexOf(item) === i);
    } else {
        image_del = [];
    }

    // console.log("image_del lúc sau",image_del)


    // PARAMETER_IS_NOT_ENOUGH
    if (id !== '' && !id) {
        // console.log("No have parameter id");
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }

    // PARAMETER_TYPE_IS_INVALID
    if ((id && typeof id !== "string") || (described && typeof described !== "string") || (status && typeof status !== "string")) {
        // console.log("PARAMETER_TYPE_IS_INVALID");
        return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
    }

    if (described && countWord(described) > MAX_WORD_POST) {
        // console.log("MAX_WORD_POST");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (status && !statusArray.includes(status)) {
        // console.log("Sai status");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (image && video) {
        // console.log("Có cả image and video gui di");
        return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
    }

    let post;
    try {
        post = await Post.findById(id);
    } catch (err) {
        // console.log("Can not connect to DB");
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

    if (!post) {
        // console.log("Post is not existed");
        return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    // console.log(post)
    // console.log(post.account_id)
    // console.log(user._id)
    if (!post.account_id.equals(user._id)) {
        // console.log("Not Access");
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }

    // Check gia tri image_del hop le
    if (image_del && image_del.length > 0) {
        for (const id_image_del of image_del) {
            let isInvalid = true;
            for (const image of post.images) {
                if (image._id == id_image_del) {
                    isInvalid = false;
                }
            }
            if (isInvalid) {
                // console.log("Sai id");
                return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
            }
        }

        // Xoa anh
        for (const id_image_del of image_del) {
            // console.log("xoa anh");
            var i;
            for (i = 0; i < post.images.length; i++) {
                if (post.images[i]._id == id_image_del) {
                    break;
                }
            }
            // console.log(i)
            try {
                cloudinary.removeImg(post.images[i].publicId);
            } catch (err) {
                return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
            }
            post.images.splice(i, 1);
        }
    }

    let promises, file;

    if (video && !image) {
        if (post.images.length != 0) {
            // console.log("Có video và ko có ảnh");
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }

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

        // promises = video.map(video => {
        //     return cloudinary.uploads(video);
        // });
        // let data = await cloudinary.uploads(video[0]);
        //     //xử lý data
        //     post.video = data;

        try {
            if (post.video.url) {
                cloudinary.removeVideo(post.video.publicId);
            }
        } catch (err) {
            return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
        }

        try {
            // file = await Promise.all(promises);
            // post.video = file[0];
            let data = await cloudinary.uploads(video[0]);
            //xử lý data
            post.video = data;
        } catch (err) {
            // console.log("Upload fail");
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }
    }

    if (image && !video) {
        console.log("đến đây");
        if (post.video.url) {
            // console.log("Có cả ảnh và video");
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }

        // for(const item_image of image) {
        //     const filetypes = /jpeg|jpg|png/;
        //     const mimetype = filetypes.test(item_image.mimetype);
        //     if(!mimetype) {
        //         console.log("Mimetype image is invalid");
        //         return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
        //     }

        //     if (item_image.buffer.byteLength > MAX_SIZE_IMAGE) {
        //         console.log("Max image file size");
        //         return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
        //     }
        // }

        if (image.length + post.images.length > MAX_IMAGE_NUMBER) {
            // console.log("Max image number");
            return setAndSendResponse(res, responseError.MAXIMUM_NUMBER_OF_IMAGES);
        }

        promises = image.map(item_image => {
            return cloudinary.uploads(item_image);
        });

        try {
            // console.log("đến đây chưa");
            file = await Promise.all(promises);
            for (let file_item of file) {
                post.images.push(file_item);
            }
            // let uploadPromises = image.map(cloudinary.uploads);
            // let data= await Promise.all(uploadPromises);
            // //xửa lý data
            // post.images = data;
        } catch (err) {
            // console.log("Upload fail");
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }
    }

    if (described) {
        // console.log("Have described");
        if (countWord(described) > MAX_WORD_POST) {
            // console.log("MAX_WORD_POST");
            return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
        }
        post.described = described;
    }

    if (status) {
        // console.log("Have status");
        post.status = status;
    }

    try {
        // post.modified = Math.floor(Date.now() / 1000);
        const savedPost = await post.save();
        return res.status(responseError.OK.statusCode).send({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message
        });
    } catch (err) {
        // console.log("Edit fail");
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }
});

postsController.report_post = expressAsyncHandler(async (req, res) => {
    const {id, subject, details} = req.body;
    const account = req.account;

    if (!id || !subject || !details) setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(id)) setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    if (subject && !subjectArray.includes(subject)) {
        // console.log("subject ko nằm trong dãy các subject mặc định");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID)
    }

    //Check user being blocked or not
    if (account.isBlocked) setAndSendResponse(res, responseError.NOT_ACCESS);

    //Get post
    const post = await Post.findById(id);
    if (post == null) setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);

    // bài viết bị khóa
    if (post.banned) {
        // console.log("bài viết bị khóa");
        return setAndSendResponse(res, responseError.POST_IS_BANNED);
    }

    //Reporter and post'author is same person
    if (account._id.toString() === post.account_id.toString()) setAndSendResponse(res, responseError.UNKNOWN_ERROR);

    let detailsModify = "";
    if (details == subject) {
        switch (subject) {
            case 'Ảnh khỏa thân':
                detailsModify = "Nội dung chứa hình ảnh hoặc video không mặc quần áo hoặc tiết lộ quá nhiều về vùng nhạy cảm của cơ thể.";
                break;
            case 'Bạo lực':
                detailsModify = "Nội dung chứa hình ảnh, video hoặc lời nhắn liên quan đến bạo lực với mục đích gây tổn thương hoặc đe dọa người khác.";
                break;
            case 'Quấy rồi':
                detailsModify = "Nội dung liên quan đến hành vi quấy rối, nhằm gây phiền toái, bóc lột hoặc xâm phạm quyền riêng tư của người khác.";
                break;
            case 'Tự tử hoặc tự gây thương tích':
                detailsModify = "Nội dung liên quan đến hành vi tự tử hoặc tự gây thương tích, bao gồm hình ảnh, video hoặc lời nhắn khuyến khích, hỗ trợ hoặc tuyên truyền các hành vi này.";
                break;
            case 'Thông tin sai sự thật':
                detailsModify = "Nội dung chứa thông tin không chính xác hoặc thiếu sự xác thực, có thể gây hiểu nhầm hoặc lan truyền thông tin sai lệch.";
                break;
            case 'Spam':
                detailsModify = "Nội dung được coi là spam khi chứa thông tin không mong muốn hoặc không liên quan, thường gây phiền toái cho người nhận.";
                break;
            case 'Bán hàng trái phép':
                detailsModify = "Nội dung liên quan đến việc quảng cáo hoặc bán hàng trái phép, vi phạm các quy định và quy tắc của nền tảng.";
                break;
            case 'Ngôn từ gây thù ghét':
                detailsModify = "Nội dung chứa ngôn từ, lời nhắn hoặc bài viết mang tính chất xúc phạm, kích động sự căm ghét hoặc phân biệt đối với một nhóm người.";
                break;
            case 'Khủng bố':
                detailsModify = "Nội dung liên quan đến hoạt động khủng bố, bao gồm tuyên truyền, quảng bá hoặc ủng hộ các hành động khủng bố.";
                break;
            default:
                detailsModify = "Mô tả không xác định cho chủ đề này.";
        }
    }

    const newReport = await new Report({
        reporter_id: account._id,
        post_id: id,
        subject: subject,
        details: details != subject ? details : detailsModify,
        status: "Đang giải quyết"
    }).save();

    post.reports_post.push(newReport._id);
    await post.save();

    setAndSendResponse(res, responseError.OK);
    // res.send(account._id)
});

postsController.like_post = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let post = await Post.findById(id);
        if (post == null) {
            return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        }

        // bài viết bị khóa
        if (post.banned) {
            // console.log("bài viết bị khóa");
            return setAndSendResponse(res, responseError.POST_IS_BANNED);
        }

        let author = await Account.findOne({_id: post.account_id}).exec();
        if (author == null) setAndSendResponse(res, responseError.NO_DATA);
        let user = req.account;

        var isBlocked = false;
        if (author?.blockedAccounts.length != 0)
            isBlocked =
                author?.blockedAccounts.findIndex((element) => {
                    return element.account.toString() === user._id.toString();
                }) !== -1;
        if (!isBlocked) {
            if (user?.blockedAccounts.length != 0)
                isBlocked =
                    user?.blockedAccounts?.findIndex((element) => {
                        return element.account.toString() === author._id.toString();
                    }) !== -1;
        }
        if (isBlocked) return callRes(res, responseError.NOT_ACCESS, 'Người viết đã chặn bạn / Bạn chặn người viết, do đó không thể like bài viết');

        if (
            post?.likedAccounts.findIndex((element) => {
                return element.equals(user._id);
            }) != -1
        )
            return setAndSendResponse(res, responseError.HAS_BEEN_LIKED);
        else {
            await Post.findOneAndUpdate(
                {_id: id},
                {$push: {likedAccounts: {_id: user._id}}}
            );
            var updatedPost = await Post.findOneAndUpdate({_id: id}, {$inc: {likes: 1}}, { new: true });
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    likes: updatedPost.likes
                }
            });
        }
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

postsController.unlike_post = expressAsyncHandler(async (req, res) => {
    const id = req.body.id;
    if (id === undefined)
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    if (req.account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
        let post = await Post.findById(id);
        if (post == null) {
            return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
        }

        // bài viết bị khóa
        if (post.banned) {
            // console.log("bài viết bị khóa");
            return setAndSendResponse(res, responseError.POST_IS_BANNED);
        }

        let author = await Account.findOne({_id: post.account_id}).exec();
        if (author == null) setAndSendResponse(res, responseError.NO_DATA);
        let user = req.account;

        // không có kiểm tra block ở đây, vì khi nó block mình hoặc mình block nó, thì vẫn unlike được, giống kiểu chia tay đòi quà

        if (
            post?.likedAccounts.findIndex((element) => {
                return element.equals(user._id);
            }) == -1
        )
            return setAndSendResponse(res, responseError.HAS_NOT_BEEN_LIKED);
        else {
            await Post.findOneAndUpdate(
                {_id: id},
                {$pull: {likedAccounts: user._id}}
            );
            var updatedPost = await Post.findOneAndUpdate({_id: id}, {$inc: {likes: -1}}, { new: true });
            res.status(responseError.OK.statusCode).json({
                code: responseError.OK.body.code,
                message: responseError.OK.body.message,
                data: {
                    likes: updatedPost.likes
                }
            });
        }
    } catch (err) {
        return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
});

// merge 2 cái report và auto-bot + admin banned
postsController.get_list_deleted_banned_posts = expressAsyncHandler(async (req, res) => {
    try {
        const posts = await Post.find({account_id: req.account._id, banned: true}).sort("-createdAt");

        // tự động khóa không cần người khác report
        const postsResult = posts.map((p) => {
            return {
                subject: "Bị khóa do Bot/Admin",
                details: "Bị khóa do Bot/Admin",
                post_id: p._id,
                account_id: p.account_id,
                postDescribed: p.described
            }
        });

        // nếu là khóa do report thì set lại subject và details
        for (let p of postsResult) {
            let report = await Report.findOne({post_id: p.post_id});
            if (report != null) {
                p.subject = report.subject,
                p.details = report.details
            }
        }

        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: postsResult
        })

    } catch (e) {

    }
})

module.exports = postsController;

