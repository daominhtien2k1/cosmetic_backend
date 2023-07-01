const express = require("express");
const adminRouter = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");

adminRouter.get("/fetch_products", auth, adminController.fetch_products);
adminRouter.patch("/update_product/:id", auth, adminController.update_product);
adminRouter.delete("/delete_product/:id", auth, adminController.delete_product);
adminRouter.post("/create_product", auth, adminController.create_product);

adminRouter.get("/fetch_accounts", auth, adminController.fetch_accounts);
adminRouter.patch("/update_account/:id", auth, adminController.update_account);
adminRouter.delete("/delete_account/:id", auth, adminController.delete_account);
adminRouter.post("/create_account", auth, adminController.create_account);

adminRouter.get('/fetch_categories', auth, adminController.fetch_categories);
adminRouter.patch('/update_category/:id', auth, adminController.update_category);
adminRouter.delete('/delete_category/:id', auth, adminController.delete_category);
adminRouter.post('/create_category', auth, adminController.create_category);

adminRouter.get('/fetch_brands', auth, adminController.fetch_brands);
adminRouter.patch('/update_brand/:id', auth, adminController.update_brand);
adminRouter.delete('/delete_brand/:id', auth, adminController.delete_brand);
adminRouter.post('/create_brand', auth, adminController.create_brand);

module.exports = adminRouter;