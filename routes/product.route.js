const express = require("express");
const productRouter = express.Router();

const productsController = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/uploadFile.middleware");

productRouter.get("/get_list_carousels", auth, productsController.get_list_carousels); // checked
productRouter.post("/add_carousel", uploadFile, auth, productsController.add_carousel); // checked
productRouter.get("/get_popular_products", auth, productsController.get_popular_products); // checked
productRouter.get("/get_product/:id", auth, productsController.get_product); // checked
productRouter.get("/get_relate_products", auth, productsController.get_relate_products); // checked
productRouter.get("/get_list_characteristics", auth, productsController.get_list_characteristics); // checked
productRouter.get("/get_loved_products", auth, productsController.get_loved_products); // checked
productRouter.get("/get_viewed_products", auth, productsController.get_viewed_products); // checked
productRouter.post("/love_product", auth, productsController.love_product); // checked
productRouter.post("/unlove_product", auth, productsController.unlove_product); // checked
productRouter.post("/view_product", auth, productsController.view_product); // checked


module.exports = productRouter;