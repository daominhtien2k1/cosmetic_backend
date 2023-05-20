const express = require("express");
const reviewRouter = express.Router();

const reviewsController = require("../controllers/review.controller");
const auth = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/uploadFile.middleware");

reviewRouter.get("/get_list_reviews", auth, reviewsController.get_list_reviews);
reviewRouter.get("/get_list_reviews_star", auth, reviewsController.get_list_reviews_star);
reviewRouter.get("/get_list_recent_reviews", auth, reviewsController.get_list_recent_reviews);

module.exports = reviewRouter;