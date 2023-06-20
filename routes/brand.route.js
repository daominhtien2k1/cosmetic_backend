const express = require("express");
const brandRouter = express.Router();

const brandController = require("../controllers/brand.controller");
const auth = require("../middlewares/auth.middleware");

brandRouter.get("/get_brand/:id", auth, brandController.get_brand);
brandRouter.post("/follow_brand", auth, brandController.follow_brand);
brandRouter.post("/unfollow_brand", auth, brandController.unfollow_brand);

module.exports = brandRouter;