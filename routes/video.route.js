const express = require("express");
const videoRouter = express.Router();

const videosController = require("../controllers/video.controller");
const auth = require("../middlewares/auth.middleware");

videoRouter.get('/get_video/:id', auth, videosController.get_video);
videoRouter.get('/get_list_videos', auth, videosController.get_list_videos);
videoRouter.post('/like_video', auth, videosController.like_video);
videoRouter.post('/unlike_video', auth, videosController.unlike_video);


module.exports = videoRouter;