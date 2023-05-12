const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const Account = require('../models/account.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const learnMongoosesController = {};

learnMongoosesController.getCountComments = expressAsyncHandler(async (req, res) => {
    // const comments = await Comment.find({post_id: '63a6cfac5727cc1540bd2eca'}).populate('post_id'); chạy được với lần data rởm nhưng lần này toàn bị lỗi "schema hasn't been registered for model"
    // https://stackoverflow.com/questions/26818071/mongoose-schema-hasnt-been-registered-for-model
    const comments = await Comment.find({post_id: '63a6cfac5727cc1540bd2eca'}).populate({path: 'post_id', model: Post});
    var x = comments[0].post_id.likedAccounts.includes('63a6854c92f5e81f48ae4e51');
    res.json({comments});
});

learnMongoosesController.getOriginalEachModelConnection = expressAsyncHandler(async (req, res) => {
    console.log(Account.db.host, Account.db.port, Account.db.name);
    console.log(Post.db.host, Post.db.port, Post.db.name);
    console.log(Comment.db.host, Comment.db.port, Comment.db.name);
    res.json("hello");
});
module.exports = learnMongoosesController;