const express = require("express");
const reportRouter = express.Router();

const auth = require("../middlewares/auth.middleware");
const reportsController = require("../controllers/report.controller");

reportRouter.get("/get_list_reported_posts", auth, reportsController.get_list_reported_posts);
reportRouter.get("/get_list_reported_reviews", auth, reportsController.get_list_reported_reviews);

module.exports = reportRouter;