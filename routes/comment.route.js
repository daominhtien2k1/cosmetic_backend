const express = require("express");
const commentRouter = express.Router();

const commentController = require("../controllers/comment.controller");
const auth = require("../middlewares/auth.middleware");

commentRouter.get('/get_comment', auth, commentController.get_comment);
commentRouter.post('/set_comment', auth, commentController.set_comment);

module.exports = commentRouter;