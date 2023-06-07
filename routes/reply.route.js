const express = require("express");
const replyRouter = express.Router();

const auth = require("../middlewares/auth.middleware");
const replyController = require("../controllers/reply.controller");

replyRouter.get('/get_reply', auth, replyController.get_reply);
replyRouter.post('/set_reply', auth, replyController.set_reply);

module.exports = replyRouter;