const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");

adminRouter.get("/fetch_products", auth, adminController.fetch_products);
adminRouter.patch("/update_product/:id", auth, adminController.update_product);
adminRouter.delete("/delete_product/:id", auth, adminController.delete_product);
adminRouter.post("/create_product", auth, adminController.create_product);

module.exports = adminRouter;