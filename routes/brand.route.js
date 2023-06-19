const express = require("express");
const brandRouter = express.Router();

const brandController = require("../controllers/brand.controller");
const auth = require("../middlewares/auth.middleware");

brandRouter.get("/get_brand/:id", auth, brandController.get_brand);

module.exports = brandRouter;