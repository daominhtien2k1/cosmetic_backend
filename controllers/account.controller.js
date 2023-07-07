const express = require("express");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');

//import cloud storage
const cloudinary = require('../config/cloudinaryConfig')

const {responseError, setAndSendResponse, callRes} = require('../constants/response_code');
const {isValidPassword, isPhoneNumber, isValidId, isValidName, checkLink} = require('../validations/validateData');
const {JWT_SECRET} = require("../constants/constants");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const {Review} = require("../models/product.model");
const Reply = require("../models/reply.model");

const accountsController = {};

accountsController.login = expressAsyncHandler(async (req, res) => {
    const {phoneNumber, password} = req.body;
    if (!phoneNumber || !password) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    if (!isPhoneNumber(phoneNumber) || !isValidPassword(password)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }
    // sẽ sửa lại bcrypt compare hashmap, hiện đang để tạm tìm như thế này
    let account = await Account.findOne({
        phoneNumber: phoneNumber, password: password,
    });
    if (account == null) {
        return setAndSendResponse(res, responseError.USER_IS_NOT_VALIDATED);
    }

    let token = jwt.sign({
        account_id: account._id, phoneNumber: phoneNumber,
    }, JWT_SECRET, {expiresIn: "30d"});
    account.online = true;
    account.token = token;
    account.avatar.url = account.getAvatar();
    account.save();
    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code, message: responseError.OK.body.message, data: {
            id: account._id, name: account.name, token: token, avatar: account.getAvatar(), active: account.active,
        },
    });
});

accountsController.signup = expressAsyncHandler(async (req, res) => {
    const {phoneNumber, password} = req.body;
    if (!phoneNumber || !password) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    if (!isPhoneNumber(phoneNumber) || !isValidPassword(password)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }
    const userExists = await Account.findOne({phoneNumber: phoneNumber});
    if (!userExists) {
        // CHƯA HASH PASSWORD, làm sau
        await new Account({
            phoneNumber: phoneNumber, password: password, // uuid: req.query.uuid
        }).save();
        return setAndSendResponse(res, responseError.OK);
    } else {
        return setAndSendResponse(res, responseError.USER_EXISTED);
    }
});

accountsController.del_request_friend = expressAsyncHandler(async (req, res) => {
    const {sender_id} = req.body;
    const receiver_id = req.account.id;

    if (!sender_id || !receiver_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(sender_id) || !isValidId(receiver_id) || sender_id === receiver_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_sender = await Account.findOne({_id: sender_id}).select(["friends", "friendRequestSent", "blockedAccounts"]);
    
    let list_of_receiver = await Account.findOne({_id: receiver_id}).select(["friendRequestReceived", "blockedAccounts"]);

    if (list_of_sender == null || list_of_receiver == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let list_friend_of_sender = list_of_sender["friends"];
    let list_sent_of_sender = list_of_sender["friendRequestSent"];
    let list_blocked_accounts_of_sender = list_of_sender["blockedAccounts"];

    let list_received_of_receiver = list_of_receiver["friendRequestReceived"];
    let list_blocked_accounts_of_receiver = list_of_receiver["blockedAccounts"];

    let hasRequest = false;
    let hasSent = false;

    for (let i of list_friend_of_sender) {
        if (i["friend"] == receiver_id) {
            return setAndSendResponse(res, responseError.HAS_BEEN_FRIEND);
        }
    }

    for (let i of list_blocked_accounts_of_sender) {
        if (i["account"] == receiver_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_blocked_accounts_of_receiver) {
        if (i["account"] == sender_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_sent_of_sender) {
        if (i["toUser"] == receiver_id) {
            hasRequest = true;
            break;
        }
    }

    for (let i of list_received_of_receiver) {
        if (i["fromUser"] == sender_id) {
            hasSent = true;
            break;
        }
    }

    if (hasRequest && hasSent) {
        var new_list_sent_of_sender = [];
        for (let i of list_sent_of_sender) {
            if (i["toUser"] != receiver_id) {
                new_list_sent_of_sender.push(i);
            }
        }

        const filter_sent = {
            _id: sender_id
        }

        const update_sent = {
            $set: {
                friendRequestSent: new_list_sent_of_sender
            }
        }

        await Account.updateOne(filter_sent, update_sent);

        var new_list_received_of_receiver = [];

        for (let i of list_received_of_receiver) {
            if (i["fromUser"] != sender_id) {
                new_list_received_of_receiver.push(i);
            }
        }

        const filter_received = {
            _id: receiver_id
        }

        const update_received = {
            $set: {
                friendRequestReceived: new_list_received_of_receiver
            }
        }

        await Account.updateOne(filter_received, update_received);

        return setAndSendResponse(res, responseError.OK);
    }

    return setAndSendResponse(res, responseError.DEL_REQUEST_FRIEND_FAILED);
});

accountsController.set_accept_friend = expressAsyncHandler(async (req, res) => {
    const {sender_id} = req.body;
    const receiver_id = req.account.id;

    if (!sender_id || !receiver_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(sender_id) || !isValidId(receiver_id) || sender_id === receiver_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_sender = await Account.findOne({_id: sender_id}).select(["friends", "friendRequestSent", "blockedAccounts"]);
    
    let list_of_receiver = await Account.findOne({_id: receiver_id}).select(["friendRequestReceived", "blockedAccounts"]);

    if (list_of_sender == null || list_of_receiver == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let list_friend_of_sender = list_of_sender["friends"];
    let list_sent_of_sender = list_of_sender["friendRequestSent"];
    let list_blocked_accounts_of_sender = list_of_sender["blockedAccounts"];

    let list_received_of_receiver = list_of_receiver["friendRequestReceived"];
    let list_blocked_accounts_of_receiver = list_of_receiver["blockedAccounts"];

    let hasRequest = false;
    let hasSent = false;

    for (let i of list_friend_of_sender) {
        if (i["friend"] == receiver_id) {
            return setAndSendResponse(res, responseError.HAS_BEEN_FRIEND);
        }
    }
    for (let i of list_blocked_accounts_of_sender) {
        if (i["account"] == receiver_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_blocked_accounts_of_receiver) {
        if (i["account"] == sender_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_sent_of_sender) {
        if (i["toUser"] == receiver_id) {
            hasRequest = true;
            break;
        }
    }
    for (let i of list_received_of_receiver) {
        if (i["fromUser"] == sender_id) {
            hasSent = true;
            break;
        }
    }

    if (hasRequest && hasSent) {
        var new_list_sent_of_sender = [];
        for (let i of list_sent_of_sender) {
            if (i["toUser"] != receiver_id) {
                new_list_sent_of_sender.push(i);
            }
        }

        const filter_sent = {
            _id: sender_id
        }

        const update_sent = {
            $set: {
                friendRequestSent: new_list_sent_of_sender
            },
            $push: {
                friends: {
                    friend: receiver_id
                }
            }
        }

        await Account.updateOne(filter_sent, update_sent);

        var new_list_received_of_receiver = [];

        for (let i of list_received_of_receiver) {
            if (i["fromUser"] != sender_id) {
                new_list_received_of_receiver.push(i);
            }
        }

        const filter_received = {
            _id: receiver_id
        }

        const update_received = {
            $set: {
                friendRequestReceived: new_list_received_of_receiver
            },
            $push: {
                friends: {
                    friend: sender_id
                }
            }
        }

        await Account.updateOne(filter_received, update_received);

        return setAndSendResponse(res, responseError.OK);
    }

    return setAndSendResponse(res, responseError.ACCEPT_REQUEST_FRIEND_FAILED);
});

accountsController.set_request_friend = expressAsyncHandler(async (req, res) => {
    const {receiver_id} = req.body;
    const sender_id = req.account.id;
    if (!sender_id || !receiver_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(sender_id)  || sender_id === receiver_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_sender = await Account.findOne({_id: sender_id}).select(["friends", "friendRequestReceived", "friendRequestSent", "blockedAccounts"]);
    let list_of_receiver = await Account.findOne({_id: receiver_id});

    if (list_of_sender == null || list_of_receiver == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let list_friend_of_sender = list_of_sender["friends"];
    let list_received_friend_of_sender = list_of_sender["friendRequestReceived"];
    let list_sent_friend_of_sender = list_of_sender["friendRequestSent"];
    let list_blocked_accounts_of_sender = list_of_sender["blockedAccounts"];

    for (let i of list_friend_of_sender) {
        if (i["friend"] == receiver_id) {
            return setAndSendResponse(res, responseError.HAS_BEEN_FRIEND);
        }
    }

    for (let i of list_received_friend_of_sender) {
        if (i["fromUser"] == receiver_id) {
            return setAndSendResponse(res, responseError.SET_REQUEST_FRIEND_FAILED);
        }
    }

    for (let i of list_sent_friend_of_sender) {
        if (i["toUser"] == receiver_id) {
            return setAndSendResponse(res, responseError.SET_REQUEST_FRIEND_FAILED);
        }
    }

    for (let i of list_blocked_accounts_of_sender) {
        if (i["account"] == receiver_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }


    const filter_send = {
        _id: sender_id,
    };

    const update_send = {
        $push: {
            friendRequestSent: {
                toUser: receiver_id
            },
        },
    };

    await Account.updateOne(filter_send, update_send);

    const filter_received = {
        _id: receiver_id,
    };

    const update_received = {
        $push: {
            friendRequestReceived: {
                fromUser: sender_id
            },
        },
    };

    await Account.updateOne(filter_received, update_received);

    return setAndSendResponse(res, responseError.OK);
});

accountsController.get_list_friend_request_received = expressAsyncHandler(async (req, res) => {
    const _id = req.account._id;
    if (!_id) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else if (!isValidId(_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    let account = await Account.findOne({_id: _id}).select("friendRequestReceived -_id" );

    let friendRequestReceived = [];
    for (let friend of account["friendRequestReceived"]){
      let account_id = friend["fromUser"];
      let _account = await Account.findOne({_id: account_id}).select(["name", "avatar"]);
      friendRequestReceived.push({
        fromUser: account_id,
        name: _account["name"],
        avatar: _account["avatar"].url,
        createdAt: friend["createdAt"]
      })
    }

    let result = {
        friendRequestReceived: friendRequestReceived
    };

    if (friendRequestReceived == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    } else {
        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    }
});

accountsController.del_friend = expressAsyncHandler(async (req, res) => {
    const {person_id} = req.body;
    const account_id = req.account.id;

    if (!person_id || !account_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(person_id) || !isValidId(account_id) || person_id === account_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_person = await Account.findOne({_id: person_id}).select(["friends"]);
    
    let list_of_account = await Account.findOne({_id: account_id}).select(["friends"]);

    if (list_of_person == null || list_of_account == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let list_friend_of_person = list_of_person["friends"];

    let list_friend_of_account = list_of_account["friends"];

    let check1 = false, check2 = false;

    for (let i of list_friend_of_person) {
        if (i["friend"] == account_id) {
            check1 = true;
            break;
        }
    }

    for (let i of list_friend_of_account) {
        if (i["friend"] == person_id) {
            check2 = true;
            break;
        }
    }

    if (check1 && check2) {
        var new_list_friend_of_person = [];
        for (let i of list_friend_of_person) {
            if (i["friend"] != account_id) {
                new_list_friend_of_person.push(i);
            }
        }

        const filter_person = {
            _id: person_id
        }

        const update_person = {
            $set: {
                friends: new_list_friend_of_person
            }
        }

        await Account.updateOne(filter_person, update_person);

        var new_list_friend_of_account = [];
        for (let i of list_friend_of_account) {
            if (i["friend"] != person_id) {
                new_list_friend_of_account.push(i);
            }
        }

        const filter_account = {
            _id: account_id
        }

        const update_account = {
            $set: {
                friends: new_list_friend_of_account
            }
        }

        await Account.updateOne(filter_account, update_account);

        return setAndSendResponse(res, responseError.OK);
    }

    return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
});

accountsController.get_list_unknown_people = expressAsyncHandler(async (req, res) => {
    const _id = req.account._id;
    if (!_id) {
      return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else if (!isValidId(_id)) {
      return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    let account = await Account.findOne({ _id: _id }).select([
      "friends",
      "blockedAccounts",
      "friendRequestReceived",
      "friendRequestSent",
    ]);

    let listPeople = []; // cần loại đi bọn đã là bạn, block, bạn bè đã gửi, nhận
    if (!account) {
      return setAndSendResponse(res, responseError.NO_DATA);
    } else {
      account["friends"].filter((e) => {
        listPeople.push(e.friend);
      });

      account["blockedAccounts"].filter((e) => {
        listPeople.push(e.account);
      });

      account["friendRequestReceived"].filter((e) => {
        listPeople.push(e.fromUser);
      });

      account["friendRequestSent"].filter((e) => {
        listPeople.push(e.toUser);
      });


      let listUnknownPeopleIdArray = await Account.find({
        $and: [{ _id: { $ne: _id } }, { _id: { $nin: listPeople } }],
      }).select("_id");

      listUnknownPeople = [];
      for (let people of listUnknownPeopleIdArray) {
        let account_id = people["_id"];
        let _account = await Account.findOne({_id: account_id}).select(["name", "avatar"]);
        listUnknownPeople.push({
          id: account_id,
          name: _account["name"],
          avatar: _account["avatar"].url
        })
      }

      let result = {
          listUnknownPeople: listUnknownPeople
      };

      res.status(responseError.OK.statusCode).json({
          code: responseError.OK.body.code,
          message: responseError.OK.body.message,
          data: result
      });

    }
  }
);

accountsController.get_list_friends = expressAsyncHandler(async (req, res) => {
    const {user_id} = req.query;
    const _id = user_id ? user_id : req.account._id;
    if (!_id) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else if (!isValidId(_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    let account = await Account.findOne({_id: _id}).select("friends -_id" );

    let listFriends = []

    for (let friend of account["friends"]){
      let account_id = friend["friend"]
      let _account = await Account.findOne({_id: account_id}).select(["name", "avatar"]);
      listFriends.push({
        friend: account_id,
        name: _account["name"],
        avatar: _account["avatar"].url,
        createdAt: friend["createdAt"]
      })
    }

    let result = {
        friends: listFriends,
        count: listFriends.length
    };

    if (listFriends == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    } else {
        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    }
});


accountsController.set_user_info = expressAsyncHandler(async (req, res) => {
    const {username, gender, description, city, country, skin} = req.body;
    const {account} = req;

    // ko gửi thông tin gì lên
    if (!username && !gender && !description && !city && !country && !skin && !req.files) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    // mô tả hơn 150 kí tự
    if (description && description.length > 150) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // tài khoản đã bị khóa
    if (account.isBlocked) {
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }


    if (username) account.name = username;
    if (gender) account.gender = gender;
    if (description) account.description = description;
    if (city) account.city = city;
    if (country) account.country = country;
    if (skin) account.skin = skin;

    // upload avatar
    if (req.files && req.files.avatar) {
        if (account.avatar && account.avatar.url !== 'https://res.cloudinary.com/it4895/image/upload/v1607791757/it4895/avatars/default-avatar_jklwc7.jpg') {
            //xóa avatar cũ
            cloudinary.removeImg(account.avatar.publicId);
        }
        // upload avatar mới
        try {
            let data = await cloudinary.uploads(req.files.avatar[0]);
            account.avatar = data;
        } catch (err) {
            console.log(err);
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }
    }

    // upload cover_image
    if (req.files && req.files.cover_image) {
        if (account.coverImage) {
            //xóa cover_image cũ
            cloudinary.removeImg(account.coverImage.publicId);
        }

        // upload cover_image
        try {
            let data = await cloudinary.uploads(req.files.cover_image[0]);
            account.coverImage = data;
        } catch (err) {
            console.log(err);
            return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
        }
    }

    await account.save();
    let data = {
        avatar: account.getAvatar(),
        coverImage: account.coverImage != undefined ? account.coverImage.url : '',
        name: account.name,
        gender: account.gender,
        phoneNumber: account.phoneNumber,
        description: account.description,
        city: account.city,
        country: account.country,
        created: account.createdAt,
        skin: account.skin,
        point: account.point,
        level: account.level
    }

    callRes(res, responseError.OK, data);
})

accountsController.get_user_info = expressAsyncHandler(async (req, res) => {
    const {user_id} = req.query;
    const account_id = req.account.id;

    let account = await Account.findOne({_id: account_id});

    if (account.isBlocked) return setAndSendResponse(res, responseError.NOT_ACCESS);


    if (user_id) {
        if (!isValidId(user_id)) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

        user = await Account.findById(user_id);

        if (!user) return setAndSendResponse(res, responseError.NO_DATA);

        if (user.isBlocked == true) {
            // console.log("tài khoản bị block");
            return setAndSendResponse(res, responseError.USER_IS_NOT_VALIDATED);
        }

        for (let i of user["blockedAccounts"]){
            if (i["account"] == account_id)
            return callRes(res, responseError.USER_IS_NOT_VALIDATED, 'Bạn bị người ta blocked rồi nên không thể lấy info của họ');
        }
        
        for (let i of account["blockedAccounts"]){
            if (i["account"] == user_id)
            return callRes(res, responseError.USER_IS_NOT_VALIDATED, 'Bạn đang blocked user muốn lấy info');
        }

    }

    let id = user_id ? user_id : account_id
    let user_info = await Account.findOne({ _id: id }).select([
        "avatar",
        "coverImage",
        "name",
        "gender",
        "phoneNumber",
        "description",
        "city",
        "country",
        "skin",
        "point",
        "level",
        "isBrand",
        "brandId"
    ]);

    let res_user_info = {
        avatar: user_info["avatar"].url,
        coverImage: user_info["coverImage"].url,
        name: user_info["name"],
        gender: user_info["gender"],
        phoneNumber: user_info["phoneNumber"],
        description: user_info["description"],
        city: user_info["city"],
        country: user_info["country"],
        skin: user_info["skin"],
        point: user_info["point"],
        level: user_info["level"],
        isBrand: user_info["isBrand"],
        brandId: user_info["brandId"]
    };
    
    return res.status(responseError.OK.statusCode).json(res_user_info);
})

accountsController.change_info_after_signup = expressAsyncHandler(async (req, res) => {
    const {username, gender, description, city, country, link} = req.body;
    const {account} = req;

    // ko gửi thông tin gì lên
    if (!username || !gender) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    // mô tả hơn 150 kí tự
    if (description && description.length > 150) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // tài khoản đã bị khóa
    if (account.isBlocked) {
        console.log("tài khoản đã bị khóa");
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }
    if (account.active) {
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }
    // tên sai định dạng
    if (username && !isValidName(username)) {
        console.log("tên sai định dạng");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID, "username");
    }
    if (!isGender(gender)) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID, "gender");
    // tên sai định dạng
    if (city && typeof city !== "string") return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
    if (country && typeof country !== "string") return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);

    if (link) {
        if (typeof link !== "string") return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);

        if (!checkLink(link)) return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
    }

    if (username) account.name = username;
    if (gender) account.gender = gender;
    if (description) account.description = description;
    if (city) account.city = city;
    if (country) account.country = country;
    if (link) account.link = link;
    account.active = true;

    // upload avatar
    await Account.findOneAndUpdate({_id: account._id}, account);

    return setAndSendResponse(res, responseError.OK);
});

accountsController.get_list_blocked_accounts = expressAsyncHandler(async (req, res) => {
    let account = await Account.findById(req.account._id);

    if (account == null) {
      return setAndSendResponse(res, responseError.NO_DATA);
    }

    let blockedAccounts = [];
    for (let item of account["blockedAccounts"]) {
        const acc = await Account.findOne({ _id: item.account });
        blockedAccounts.push({
            account: item.account,
            name: acc.name,
            avatar: acc.avatar.url
        });
    }
    if (blockedAccounts == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    } else {
        let result = {
            blockedAccounts: blockedAccounts
        }
        res.status(responseError.OK.statusCode).json({
            code: responseError.OK.body.code,
            message: responseError.OK.body.message,
            data: result
        });
    }
});

// block sẽ xóa trường friends, friendRequestSent, friendRequestReceived của cả 2 bên
accountsController.block_person = expressAsyncHandler(async (req, res) => {
    const {person_id} = req.body;
    const account_id = req.account.id;

    if (!person_id || !account_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(person_id) || !isValidId(account_id) || person_id === account_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    try {
        let list_of_person = await Account.findOne({_id: person_id}).select(["friends", "friendRequestSent", "friendRequestReceived", "blockedAccounts"]);
        let list_of_account = await Account.findOne({_id: account_id}).select(["friends", "friendRequestReceived", "friendRequestSent", "blockedAccounts"]);

        if (list_of_person == null || list_of_account == null) {
            return setAndSendResponse(res, responseError.NO_DATA);
        }

        const list_my_blocked_accounts = list_of_account["blockedAccounts"];
        const list_blocked_accounts_of_person = list_of_person["blockedAccounts"];
        if ( list_my_blocked_accounts.find(element => element.account.toString() === person_id) != null ) {
            return callRes(res, responseError.NOT_ACCESS, "Bạn đã chặn người ta rồi");
        }
        if ( list_blocked_accounts_of_person.find(element => element.account.toString() === account_id) != null ) {
            return callRes(res, responseError.NOT_ACCESS, "Không thể chặn do người ta chặn bạn");
        }

    // kiểm tra nếu có trong friendRequestSent của mình + friendRequestReceived của nó, nếu có thì xóa
        let list_received_of_person = list_of_person["friendRequestReceived"];
        let list_sent_of_account = list_of_account["friendRequestSent"];
        if (   list_received_of_person.find(item => item.fromUser.equals(account_id) != null)
            && list_sent_of_account.find(item => item.toUser.equals(person_id) != null)
        ) {
            await Account.findOneAndUpdate({_id: person_id}, {
                $pull: {
                    friendRequestReceived: {
                        fromUser: account_id
                    }
                }
            });

            await Account.findOneAndUpdate({_id: account_id}, {
                $pull: {
                    friendRequestSent: {
                        toUser: person_id
                    }
                }
            });
        }


    // kiểm tra nếu có trong friendRequestReceived của mình + friendRequestSent của nó, nếu có thì xóa
        let list_sent_of_person = list_of_person["friendRequestSent"];
        let list_received_of_account = list_of_account["friendRequestReceived"];

        let hasRequest = false;
        let hasSent = false;

        for (let i of list_sent_of_person) {
            if (i["toUser"] == account_id) {
                hasRequest = true;
                break;
            }
        }

        for (let i of list_received_of_account) {
            if (i["fromUser"] == person_id) {
                hasSent = true;
                break;
            }
        }

        if (hasRequest && hasSent) {
            var new_list_sent_of_person = [];
            for (let i of list_sent_of_person) {
                if (i["toUser"] != account_id) {
                    new_list_sent_of_person.push(i);
                }
            }
            const filter_sent = {
                _id: person_id
            }
            const update_sent = {
                $set: {
                    friendRequestSent: new_list_sent_of_person
                }
            }
            await Account.updateOne(filter_sent, update_sent);

            var new_list_received_of_account = [];
            for (let i of list_received_of_account) {
                if (i["fromUser"] != person_id) {
                    new_list_received_of_account.push(i);
                }
            }
            const filter_received = {
                _id: account_id
            }
            const update_received = {
                $set: {
                    friendRequestReceived: new_list_received_of_account
                }
            }

            await Account.updateOne(filter_received, update_received);
        }


    // kiểm tra nếu có trong friends của minh + friends của nó, nếu có thì xóa
        let list_friend_of_person = list_of_person["friends"];
        let list_friend_of_account = list_of_account["friends"];
        let check1 = false, check2 = false;

        for (let i of list_friend_of_person) {
            if (i["friend"] == account_id) {
                check1 = true;
                break;
            }
        }

        for (let i of list_friend_of_account) {
            if (i["friend"] == person_id) {
                check2 = true;
                break;
            }
        }

        if (check1 && check2) {
            var new_list_friend_of_person = [];
            for (let i of list_friend_of_person) {
                if (i["friend"] != account_id) {
                    new_list_friend_of_person.push(i);
                }
            }
            const filter_person = {
                _id: person_id
            }
            const update_person = {
                $set: {
                    friends: new_list_friend_of_person
                }
            }
            await Account.updateOne(filter_person, update_person);

            var new_list_friend_of_account = [];
            for (let i of list_friend_of_account) {
                if (i["friend"] != person_id) {
                    new_list_friend_of_account.push(i);
                }
            }
            const filter_account = {
                _id: account_id
            }
            const update_account = {
                $set: {
                    friends: new_list_friend_of_account
                }
            }
            await Account.updateOne(filter_account, update_account);
        }



    // cập nhật lại blockedAccounts của mình
        await Account.findOneAndUpdate({_id: account_id}, {
            $push: {
                blockedAccounts: {
                    account: person_id
                }
            }
        });

        return setAndSendResponse(res, responseError.OK);
    } catch (err) {
        console.log(err);
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

})

accountsController.remove_blocked_account = expressAsyncHandler(async (req, res) => {
    const {person_id} = req.body;
    const account_id = req.account.id;
    // ảo ma, vẫn chạy được như nhau
    // console.log(req.account._id);
    // console.log(req.account.id);
    // console.log(typeof req.account._id); // object
    // console.log(typeof req.account.id); // string
    // console.log(typeof person_id); // string

    if (!person_id || !account_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(person_id) || !isValidId(account_id) || person_id === account_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    try {
        let account = await Account.findOne({_id: account_id}); // OK
        // let account2 = await Account.findOne({_id: req.account._id}); // OK
        // let account3 = await Account.findById(req.account.id); // OK
        // let account4 = await Account.findById(req.account._id); // OK

        // console.log(
        //     account.blockedAccounts.find(item => {
        //       // console.log(item.account);
        //       // console.log(typeof item.account); // object
        //       //   console.log(item.account.equals(person_id)); // true
        //       //   console.log(item.account == person_id); // true
        //       //   console.log(item.account === person_id); // false
        //       //   console.log(item.account.toString() == person_id); // true
        //       //   console.log(item.account.toString() === person_id); // true
        //       //   console.log(item.account.toString() === person_id.toString()); // true
        //       return item.account.equals(person_id);
        //     })
        // );

        if (!account.blockedAccounts.find(item => item.account.equals(person_id))) {
            return setAndSendResponse(res, responseError.HAS_NOT_BLOCK);
        }

        await Account.findOneAndUpdate({_id: account_id}, {
            $pull: {
                blockedAccounts: {
                    account: person_id
                }
            }
        });
        return setAndSendResponse(res, responseError.OK);
    } catch (err) {
        console.log(err);
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

})

accountsController.change_password = expressAsyncHandler(async (req, res) => {
    const {password, newPassword} = req.body;
    if (!password || !newPassword) {
        return callRes(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    if (!isValidPassword(password)) {
        return callRes(res, responseError.PARAMETER_VALUE_IS_INVALID, "password");
    }
    if (!isValidPassword(newPassword)) {
        return callRes(res, responseError.PARAMETER_VALUE_IS_INVALID, "newPassword");
    }

    if (password == newPassword) {
        return callRes(res, responseError.PARAMETER_VALUE_IS_INVALID, "newPassword == password");
    }

    // Check xau con chung dai nhat > 80%
    // var OverlapSubStringRatio =
    //   LCS(password, newPassword).length / newPassword.length;
    // if (OverlapSubStringRatio > 0.8) {
    //   return callRes(
    //     res,
    //     responseError.PARAMETER_VALUE_IS_INVALID,
    //     "newPassword va password co xau con chung/newPassword > 80%"
    //   );
    // }
    try {
        user = await Account.findOne({_id: req.account._id});
        if (password != user.password) {
            return setAndSendResponse(res, responseError.PASSWORD_IS_INCORRECT);
        }
        await Account.findOneAndUpdate({_id: req.account._id}, {password: newPassword});
        return setAndSendResponse(res, responseError.OK);
    } catch (err) {
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

    // var isPassword = bcrypt.compareSync(password, user.password);
    // if (!isPassword) {
    //   return callRes(
    //     res,
    //     responseError.PARAMETER_VALUE_IS_INVALID,
    //     "password khong dung"
    //   );
    // }
});

accountsController.logout = expressAsyncHandler(async (req, res) => {
    const {account} = req;
    await Account.findOneAndUpdate({_id: account._id}, {token: undefined});
    return setAndSendResponse(res, responseError.OK);
});

accountsController.increase_point_level = expressAsyncHandler(async (req, res) => {
    const levelThresholds = {
        1: 0,
        2: 500,
        3: 1000,
        4: 1500,
        5: 2000,
        6: 2500,
        7: 3000,
        8: 3500,
        9: 4000,
        10: 4500
    };

    function checkLevelThresholds() {
        for (let level in levelThresholds) {
            if (account.point >= levelThresholds[level] && account.level < level) {
                account.level = parseInt(level);
            }
        }
    }

    const point = parseInt(req.body.point);
    const {account} = req;

    if (!point) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else {
        account.point += point;
        checkLevelThresholds();
        await account.save();
        return callRes(res, responseError.OK, "Tăng point thành công");
    }

});

accountsController.statistic_overall = expressAsyncHandler(async (req, res) => {
    const postCount = await Post.countDocuments({account_id: req.account._id});
    const reviewCount = await Review.countDocuments({userReview_id: req.account._id});

    // add all
    const commentCount = await Comment.countDocuments({userComment_id: req.account._id});
    const replyCount = await Reply.countDocuments({userReview_id: req.account._id});

    const result = {
        postCount: postCount,
        reviewCount: reviewCount,
        otherActivityCount: commentCount + replyCount
    }
    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
    });

});

accountsController.get_relationship_with_person = expressAsyncHandler(async (req, res) => {
    const {person_id} = req.query;
    const account_id = req.account.id;

    if (!person_id || !account_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(person_id) || !isValidId(account_id) || person_id === account_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    const list_my_friend = req.account.friends;
    const list_my_sent = req.account.friendRequestSent;
    const list_my_received = req.account.friendRequestReceived;
    const list_my_blocked_accounts = req.account.blockedAccounts;

    const person = await Account.findById(person_id);
    const list_blocked_accounts_of_person = person.blockedAccounts;

    let relationship = "Unknown";
    // console.log(list_my_friend.find(element => element.friend.toString() === account._id.toString()))
    // console.log(list_my_friend.find(element => element.friend == account._id.toString()))
    if (account_id === person_id) {
        relationship = "Me";
    } else if (list_my_friend.find(element => element.friend.toString() === person_id) != null) {
        relationship = "Friend";
    } else if (list_my_sent.find(element => element.toUser.toString() === person_id) != null) {
        relationship = "Sent friend request";
    } else if (list_my_received.find(element => element.fromUser.toString() === person_id) != null) {
        relationship = "Received friend request";
    } else if ( list_my_blocked_accounts.find(element => element.account.toString() === person_id) != null
        || list_blocked_accounts_of_person.find(element => element.account.toString() === account_id) != null ) {
        relationship = "Block";
    } else {
        relationship = "Unknown";
    }

    const result = {
        relationship: relationship
    };

    res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result
    });
});

module.exports = accountsController;
