const express = require("express");
const reviewRouter = express.Router();

const reviewsController = require("../controllers/review.controller");
const auth = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/uploadFile.middleware");

reviewRouter.get("/get_list_reviews", auth, reviewsController.get_list_reviews);
reviewRouter.get("/get_list_instruction_reviews", auth, reviewsController.get_list_instruction_reviews);
reviewRouter.get("/get_list_reviews_star", auth, reviewsController.get_list_reviews_star);
reviewRouter.get("/get_list_recent_reviews", auth, reviewsController.get_list_recent_reviews);
reviewRouter.get("/product_characteristic_statistics", auth, reviewsController.product_characteristic_statistics);
reviewRouter.post("/add_review", uploadFile, auth, reviewsController.add_review);
reviewRouter.get("/get_review/:id", auth, reviewsController.get_review);

module.exports = reviewRouter;