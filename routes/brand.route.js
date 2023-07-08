const express = require("express");
const brandRouter = express.Router();

const brandController = require("../controllers/brand.controller");
const auth = require("../middlewares/auth.middleware");

brandRouter.get("/get_brand/:id", auth, brandController.get_brand); // checked
brandRouter.post("/follow_brand", auth, brandController.follow_brand); // checked
brandRouter.post("/unfollow_brand", auth, brandController.unfollow_brand); // checked
brandRouter.get("/get_followed_brands", auth, brandController.get_followed_brands); // checked
brandRouter.get("/get_list_brands", auth, brandController.get_list_brands); // checked

module.exports = brandRouter;