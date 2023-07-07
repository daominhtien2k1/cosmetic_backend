const express = require("express");
const accountRouter = express.Router();

const accountsController = require("../controllers/account.controller");
const auth = require("../middlewares/auth.middleware");
const uploadAvatarOrCoverImageMiddleware = require("../middlewares/uploadAvatarOrCoverImage.middleware");

accountRouter.post("/login", accountsController.login); // checked
accountRouter.post("/signup", accountsController.signup);
accountRouter.post("/del_request_friend", auth, accountsController.del_request_friend); // checked
accountRouter.post("/set_accept_friend", auth, accountsController.set_accept_friend); // checked
accountRouter.post("/set_request_friend", auth, accountsController.set_request_friend); // checked
accountRouter.get("/get_list_friend_request_received", auth, accountsController.get_list_friend_request_received); // checked
accountRouter.post("/del_friend", auth, accountsController.del_friend); // checked
accountRouter.get("/get_list_unknown_people", auth, accountsController.get_list_unknown_people); // checked
accountRouter.get("/get_list_friends", auth, accountsController.get_list_friends); // checked (me, another)
accountRouter.get('/get_user_info', auth, accountsController.get_user_info); // checked (me, another)
accountRouter.post('/set_user_info', uploadAvatarOrCoverImageMiddleware, auth, accountsController.set_user_info); // checked
accountRouter.get("/get_list_blocked_accounts", auth, accountsController.get_list_blocked_accounts); // checked
accountRouter.post("/change_password", auth, accountsController.change_password);
accountRouter.post("/change_info_after_signup", auth, accountsController.change_info_after_signup);
accountRouter.post("/logout", auth, accountsController.logout); // checked
accountRouter.post("/block_person",auth, accountsController.block_person); // checked
accountRouter.post("/remove_blocked_account",auth, accountsController.remove_blocked_account); // checked
accountRouter.post("/increase_point_level", auth, accountsController.increase_point_level);
accountRouter.get("/statistic_overall", auth, accountsController.statistic_overall); // checked
accountRouter.get("/get_relationship_with_person", auth, accountsController.get_relationship_with_person); // checked

module.exports = accountRouter;
