const express = require("express");
const productRouter = express.Router();

const productsController = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/uploadFile.middleware");

productRouter.get("/get_list_carousels", auth, productsController.get_list_carousels);
productRouter.post("/add_carousel", uploadFile, auth, productsController.add_carousel);

module.exports = productRouter;