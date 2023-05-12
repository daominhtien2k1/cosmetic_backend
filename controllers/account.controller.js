const express = require("express");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');

//import cloud storage
const cloudinary = require('../config/cloudinaryConfig')

const {responseError, setAndSendResponse, callRes} = require('../constants/response_code');
const {isValidPassword, isPhoneNumber, isValidId, isValidName, checkLink} = require('../validations/validateData');
const {JWT_SECRET} = require("../constants/constants");

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
    const {sent_id} = req.body;
    const received_id = req.account.id;

    if (!sent_id || !received_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(sent_id) || !isValidId(received_id) || sent_id === received_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_sender = await Account.findOne({_id: sent_id}).select(["friends", "friendRequestSent", "blockedAccounts",]);
    
    let list_of_receiver = await Account.findOne({_id: received_id}).select(["friendRequestReceived", "blockedAccounts",]);

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
        if (i["friend"] == received_id) {
            return setAndSendResponse(res, responseError.HAS_BEEN_FRIEND);
        }
    }

    for (let i of list_blocked_accounts_of_sender) {
        if (i["account"] == received_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_blocked_accounts_of_receiver) {
        if (i["account"] == sent_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_sent_of_sender) {
        if (i["toUser"] == received_id) {
            hasRequest = true;
            break;
        }
    }

    for (let i of list_received_of_receiver) {
        if (i["fromUser"] == sent_id) {
            hasSent = true;
            break;
        }
    }

    if (hasRequest && hasSent) {
        var new_list_sent_of_sender = [];
        for (let i of list_sent_of_sender) {
            if (i["toUser"] != received_id) {
                new_list_sent_of_sender.push(i);
            }
        }

        const filter_sent = {
            _id: sent_id
        }

        const update_sent = {
            $set: {
                friendRequestSent: new_list_sent_of_sender
            }
        }

        await Account.updateOne(filter_sent, update_sent);

        var new_list_received_of_receiver = [];

        for (let i of list_received_of_receiver) {
            if (i["fromUser"] != sent_id) {
                new_list_received_of_receiver.push(i);
            }
        }

        const filter_received = {
            _id: received_id
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
    const {sent_id} = req.body;
    const received_id = req.account.id;

    if (!sent_id || !received_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(sent_id) || !isValidId(received_id) || sent_id === received_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_sender = await Account.findOne({_id: sent_id}).select(["friends", "friendRequestSent", "blockedAccounts",]);
    
    let list_of_receiver = await Account.findOne({_id: received_id}).select(["friendRequestReceived", "blockedAccounts",]);

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
        if (i["friend"] == received_id) {
            return setAndSendResponse(res, responseError.HAS_BEEN_FRIEND);
        }
    }

    for (let i of list_blocked_accounts_of_sender) {
        if (i["account"] == received_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_blocked_accounts_of_receiver) {
        if (i["account"] == sent_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }
    for (let i of list_sent_of_sender) {
        if (i["toUser"] == received_id) {
            hasRequest = true;
            break;
        }
    }

    for (let i of list_received_of_receiver) {
        if (i["fromUser"] == sent_id) {
            hasSent = true;
            break;
        }
    }

    if (hasRequest && hasSent) {
        var new_list_sent_of_sender = [];
        for (let i of list_sent_of_sender) {
            if (i["toUser"] != received_id) {
                new_list_sent_of_sender.push(i);
            }
        }

        const filter_sent = {
            _id: sent_id
        }

        const update_sent = {
            $set: {
                friendRequestSent: new_list_sent_of_sender
            },
            $push: {
                friends: {
                    friend: received_id
                }
            }
        }

        await Account.updateOne(filter_sent, update_sent);

        var new_list_received_of_receiver = [];

        for (let i of list_received_of_receiver) {
            if (i["fromUser"] != sent_id) {
                new_list_received_of_receiver.push(i);
            }
        }

        const filter_received = {
            _id: received_id
        }

        const update_received = {
            $set: {
                friendRequestReceived: new_list_received_of_receiver
            },
            $push: {
                friends: {
                    friend: sent_id
                }
            }
        }

        await Account.updateOne(filter_received, update_received);

        return setAndSendResponse(res, responseError.OK);
    }

    return setAndSendResponse(res, responseError.ACCECPT_REQUEST_FRIEND_FAILED);
});

accountsController.set_request_friend = expressAsyncHandler(async (req, res) => {
    const {received_id} = req.body;
    const sent_id = req.account.id;
    if (!sent_id || !received_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    if (!isValidId(sent_id)  || sent_id === received_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let account = await Account.findOne({_id: sent_id}).select(["friends", "friendRequestReceived", "friendRequestSent", "blockedAccounts",]);
    let account_sent = await Account.findOne({_id: received_id});

    if (account == null || account_sent == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let list_friend = account["friends"];
    let list_received_friend = account["friendRequestReceived"];
    let list_sent_friend = account["friendRequestSent"];
    let list_blockedAccounts = account["blockedAccounts"];

    for (let i of list_friend) {
        if (i["friend"] == received_id) {
            return setAndSendResponse(res, responseError.HAS_BEEN_FRIEND);
        }
    }

    for (let i of list_received_friend) {
        if (i["fromUser"] == received_id) {
            return setAndSendResponse(res, responseError.SET_REQUEST_FRIEND_FAILED);
        }
    }

    for (let i of list_sent_friend) {
        if (i["toUser"] == received_id) {
            return setAndSendResponse(res, responseError.SET_REQUEST_FRIEND_FAILED);
        }
    }

    for (let i of list_blockedAccounts) {
        if (i["account"] == received_id) {
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
    }

    var date = Date.now();
    const filter_send = {
        _id: sent_id,
    };
    const _sent_id = {
        toUser: received_id, createdAt: date,
    };
    const update_send = {
        $push: {
            friendRequestSent: _sent_id,
        },
    };

    const filter_received = {
        _id: received_id,
    };
    const _id_received = {
        fromUser: sent_id, createdAt: date,
    };
    const update_received = {
        $push: {
            friendRequestReceived: _id_received,
        },
    };

    await Account.updateOne(filter_send, update_send);
    await Account.updateOne(filter_received, update_received);
    console.log("ok r nha")
    return setAndSendResponse(res, responseError.OK);
});

accountsController.get_requested_friends = expressAsyncHandler(async (req, res) => {
    const _id = req.account._id;
    if (!_id) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else if (!isValidId(_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    let account = await Account.findOne({_id: _id}).select("friendRequestReceived -_id" );

    let RequestReceivedFriend = []

    for (let friend of account["friendRequestReceived"]){
      let account_id = friend["fromUser"]
      let _account = await Account.findOne({_id: account_id}).select(["name", "avatar"]);
      RequestReceivedFriend.push({
        fromUser: account_id,
        name: _account["name"],
        avatar: _account["avatar"].url,
        createdAt: friend["createdAt"]
      })
    }

    if (RequestReceivedFriend == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    } else {
        return res.status(responseError.OK.statusCode).json({RequestReceivedFriend});
    }
});


accountsController.del_friend = expressAsyncHandler(async (req, res) => {
    const {sent_id} = req.body;
    const received_id = req.account.id;

    if (!sent_id || !received_id) return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);

    if (!isValidId(sent_id) || !isValidId(received_id) || sent_id === received_id) return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);

    let list_of_sender = await Account.findOne({_id: sent_id}).select(["friends",]);
    
    let list_of_receiver = await Account.findOne({_id: received_id}).select(["friends"]);

    if (list_of_sender == null || list_of_receiver == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    }

    let list_friend_of_sender = list_of_sender["friends"];

    let list_friend_of_receiver = list_of_receiver["friends"];

    let check1 = false, check2 = false;

    for (let i of list_friend_of_sender) {
        if (i["friend"] == received_id) {
            check1 = true;
            break;
        }
    }

    for (let i of list_friend_of_receiver) {
        if (i["friend"] == sent_id) {
            check2 = true;
            break;
        }
    }

    if (check1 && check2) {
        var new_list_friend_of_sender = [];
        for (let i of list_friend_of_sender) {
            if (i["friend"] != received_id) {
                new_list_friend_of_sender.push(i);
            }
        }

        const filter_sent = {
            _id: sent_id
        }

        const update_sent = {
            $set: {
                friends: new_list_friend_of_sender
            }
        }

        await Account.updateOne(filter_sent, update_sent);

        var new_list_friend_of_receiver = [];

        for (let i of list_friend_of_receiver) {
            if (i["friend"] != sent_id) {
                new_list_friend_of_receiver.push(i);
            }
        }

        const filter_received = {
            _id: received_id
        }

        const update_received = {
            $set: {
                friends: new_list_friend_of_receiver
            }
        }

        await Account.updateOne(filter_received, update_received);

        return setAndSendResponse(res, responseError.OK);
    }

    return setAndSendResponse(res, {
      statusCode: 400,
      body: {
        code: "503",
        message: "Failed to delete friend",
      },
    });
});

accountsController.get_list_unknown_people = expressAsyncHandler(
  async (req, res) => {
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
    let ListPeople = [];
    if (!account) {
      return setAndSendResponse(res, responseError.NO_DATA);
    } else {
      account["friends"].filter((friend) => {
        ListPeople.push(friend.friend);
      });

      account["blockedAccounts"].filter((friend) => {
        ListPeople.push(friend.friend);
      });

      account["friendRequestReceived"].filter((friend) => {
        ListPeople.push(friend.friend);
      });

      account["friendRequestSent"].filter((friend) => {
        ListPeople.push(friend.friend);
      });


      let _ListUnknownPeople = await Account.find({
        $and: [{ _id: { $ne: _id } }, { _id: { $nin: ListPeople } }],
      }).select("_id");

      ListUnknownPeople = [];
      
      for (let people of _ListUnknownPeople){
        let account_id = people["_id"]
        let _account = await Account.findOne({_id: account_id}).select(["name", "avatar"]);
        ListUnknownPeople.push({
          id: account_id,
          name: _account["name"],
          avatar: _account["avatar"].url
        })
      }

      return res.status(responseError.OK.statusCode).json({ ListUnknownPeople });
    }
  }
);


accountsController.get_list_friends = expressAsyncHandler(async (req, res) => {
    const {user_id} = req.query;
    const _id = user_id?user_id:req.account._id;
    if (!_id) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else if (!isValidId(_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    let account = await Account.findOne({_id: _id}).select("friends -_id" );

    let ListFriends = []

    for (let friend of account["friends"]){
      let account_id = friend["friend"]
      let _account = await Account.findOne({_id: account_id}).select(["name", "avatar"]);
      ListFriends.push({
        friend: account_id,
        name: _account["name"],
        avatar: _account["avatar"].url,
        createdAt: friend["createdAt"]
      })
    }

    if (ListFriends == null) {
        return setAndSendResponse(res, responseError.NO_DATA);
    } else {
        return res.status(responseError.OK.statusCode).json({ListFriends});
    }
});


accountsController.set_user_info = expressAsyncHandler(async (req, res) => {
    const {username, description, city, country, link} = req.body;
    const {account} = req;

    // ko gửi thông tin gì lên
    if (!username && !description && !city && !country && !link && !req.files) {
        console.log("ko gửi thông tin gì lên")
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    // mô tả hơn 150 kí tự
    if (description && description.length > 150) {
        console.log("mô tả hơn 150 kí tự");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    // tài khoản đã bị khóa
    if (account.isBlocked) {
        console.log("tài khoản đã bị khóa");
        return setAndSendResponse(res, responseError.NOT_ACCESS);
    }

    // tên sai định dạng
    if (username && !isValidName(username)) {
        console.log("tên sai định dạng");
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }
    // tên sai định dạng
    if (city && typeof city !== "string") return callRes(res, responseError.PARAMETER_TYPE_IS_INVALID, 'city');
    if (country && typeof country !== "string") return callRes(res, responseError.PARAMETER_TYPE_IS_INVALID, 'country');
    if (link) {
        if (typeof link !== "string") return callRes(res, responseError.PARAMETER_TYPE_IS_INVALID, 'link');
        if (!checkLink(link)) return callRes(res, responseError.PARAMETER_VALUE_IS_INVALID, 'link ' + link + ' banned');
    }

    if (username) account.name = username;
    if (description) account.description = description;
    if (city) account.city = city;
    if (country) account.country = country;
    if (link) account.link = link;

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
        cover_image: account.coverImage != undefined ? account.coverImage.url : '',
        username: account.name,
        link: account.link,
        city: account.city,
        country: account.country,
        created: account.createdAt.getTime().toString(),
        description: account.description,
    }

    callRes(res, responseError.OK, data)
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
            console.log("tài khoản bị block");
            return setAndSendResponse(res, responseError.USER_IS_NOT_VALIDATED);
        }

        for (let i of user["blockedAccounts"]){
            if (i["account"]==account_id)
            return callRes(res, responseError.USER_IS_NOT_VALIDATED, 'Bạn bị người ta blocked rồi nên không thể lấy info của họ');
        }
        
        for (let i of account["blockedAccounts"]){
            if (i["account"]==user_id)
            return callRes(res, responseError.USER_IS_NOT_VALIDATED, 'Bạn đang blocked user muốn lấy info');
        }

    } 
    let id = user_id?user_id:account_id
    let user_info = await Account.findOne({ _id: id }).select([
      "avatar",
      "coverImage",
      "name",
      "gender",
      "phoneNumber",
      "description",
      "city",
      "country",
      "createdAt",
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
      createdAt: user_info["createdAt"],
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

accountsController.get_block_account = expressAsyncHandler(async (req, res) => {
    const {_id} = req.account?._id;
    if (!_id) {
        return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    } else if (!isValidId(_id)) {
        return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    let account = await Account.findOne({_id: _id});

    if (account == null) {
      return setAndSendResponse(res, responseError.NO_DATA);
  } else {
    let data = [];
    for (let item of account.blockedAccounts) {
      const acc = await Account.findById({ _id: item.account });
      data.push({
        user: {
          id: item.account,
          name: acc.name,
          avatar: acc.avatar.url,
        },
        createdAt: item.createdAt,
      });
    }
    return callRes(res, responseError.OK, { blockedAccounts: data });
  }
});
 
accountsController.block_by_id = expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    if(!id)  {
        return callRes(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    if(!Account.findById(id)) {
        return callRes(res. responseError.NO_DATA);
    }
    if(id == req?.account?._id){
        
        return callRes(res. responseError.NOT_ACCESS);
    }
    try {
        user = await Account.findOne({_id: req.account._id});
        if (
            user.blockedAccounts.find(item =>{
                return item.account.equals(id)
            })
        ){
            return setAndSendResponse(res, responseError.HAS_BLOCK);
        }
        await Account.findOneAndUpdate({_id: req.account._id}, 
            {$push: 
                {blockedAccounts: 
                    {account: id, createdAt: Date.now()}
                }
            }
        );
        return setAndSendResponse(res, responseError.OK);
    } catch (err) {
        return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
    }

})
accountsController.remove_block_by_id = expressAsyncHandler(async (req, res) => {
    const {id} = req.body;
    if(!id)  {
        return callRes(res, responseError.PARAMETER_IS_NOT_ENOUGH);
    }
    if(!Account.findById(id)) {
        return callRes(res. responseError.NO_DATA);
    }
    if(id == req?.account?._id){
        
        return callRes(res. responseError.NOT_ACCESS);
    }
    try {
        user = await Account.findOne({_id: req.account._id});
        if (
            !user.blockedAccounts.find(item =>{
                return item.account.equals(id)
            })
        ){
            return setAndSendResponse(res, responseError.HAS_NOT_BLOCK);
        }
        await Account.findOneAndUpdate({_id: req.account._id}, 
            {$pull: 
                {blockedAccounts: 
                    {account: id,}
                }
            }
        );
        return setAndSendResponse(res, responseError.OK);
    } catch (err) {
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

module.exports = accountsController;
