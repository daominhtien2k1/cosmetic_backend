const express = require("express");
const accountRouter = express.Router();

const accountsController = require("../controllers/account.controller");
const auth = require("../middlewares/auth.middleware");
const uploadAvatarOrCoverImageMiddleware = require("../middlewares/uploadAvatarOrCoverImage.middleware");

accountRouter.post("/login", accountsController.login);
accountRouter.post("/signup", accountsController.signup);
accountRouter.post("/del_request_friend", auth, accountsController.del_request_friend);
accountRouter.post("/set_accept_friend", auth, accountsController.set_accept_friend);
accountRouter.post(
    "/set_request_friend", auth,
    accountsController.set_request_friend
);
accountRouter.get(
    "/get_requested_friends", auth,
    accountsController.get_requested_friends
);

accountRouter.post(
    "/del_friend", auth,
    accountsController.del_friend
);
accountRouter.get(
  "/get_list_unknown_people",
  auth,
  accountsController.get_list_unknown_people
);
accountRouter.get(
  "/get_list_friends",
  auth,
  accountsController.get_list_friends
);

accountRouter.get('/get_user_info', auth, accountsController.get_user_info);
accountRouter.post('/set_user_info', uploadAvatarOrCoverImageMiddleware, auth, accountsController.set_user_info);

accountRouter.get(
    "/get_blocked_account",
    auth,
    accountsController.get_block_account
);
accountRouter.post(
    "/change_password",
    auth,
    accountsController.change_password
);
accountRouter.post(
    "/change_info_after_signup",
    auth,
    accountsController.change_info_after_signup
);
accountRouter.post("/logout", auth, accountsController.logout);
accountRouter.post("/block_by_id",auth, accountsController.block_by_id)
accountRouter.post("/remove_block_by_id",auth, accountsController.remove_block_by_id)


module.exports = accountRouter;
