const express = require("express");
const postRouter = express.Router();

const postsController = require("../controllers/post.controller");
//import middleware
const uploadFile = require('../middlewares/uploadFile.middleware');
const auth = require('../middlewares/auth.middleware');

postRouter.get('/get_post/:id', auth, postsController.get_post);
postRouter.get('/get_list_posts', auth, postsController.get_list_posts);
postRouter.get('/get_list_posts/:account_id', auth, postsController.get_list_posts_by_account_id);

postRouter.post('/add_post', uploadFile, auth, postsController.add_post);
postRouter.delete('/delete_post/:id', auth, postsController.delete_post);
postRouter.post('/edit_post', uploadFile, auth, postsController.edit_post);
postRouter.post('/report_post', auth, postsController.report_post);

postRouter.post("/like_post", auth, postsController.like_post);
postRouter.post("/unlike_post", auth, postsController.unlike_post);

module.exports = postRouter;
