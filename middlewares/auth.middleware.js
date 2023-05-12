const jwt = require('jsonwebtoken');
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');
const {setAndSendResponse, responseError} = require('../constants/response_code');
const {JWT_SECRET} = require("../constants/constants");

const authToken = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization;
    }else{
        token = req.body.token;
    }

    if (!token) {
        return setAndSendResponse(res, responseError.NOT_AUTHORIZED_NO_TOKEN);
    }else{
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.account = await Account.findById(decoded.account_id).select("-password");
            // let account = await Account.findById(decoded.account_id);
            // req.account = account;
            next(); // next để gọi tiếp hàm sau
        } catch (error) {
            return setAndSendResponse(res, responseError.NOT_AUTHORIZED_TOKEN_FAILED);
        }
    }
})

module.exports = authToken;