const express = require("express");
const productRouter = express.Router();

const productsController = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/uploadFile.middleware");

productRouter.get("/get_list_carousels", auth, productsController.get_list_carousels);
productRouter.post("/add_carousel", uploadFile, auth, productsController.add_carousel);
productRouter.get("/get_popular_products", auth, productsController.get_popular_products);
productRouter.get("/get_product/:id", auth, productsController.get_product);
productRouter.get("/get_relate_products", auth, productsController.get_relate_products);
productRouter.get("/get_list_characteristics", auth, productsController.get_list_characteristics);

module.exports = productRouter;