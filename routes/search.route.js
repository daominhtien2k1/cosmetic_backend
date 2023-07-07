const express = require("express");
const searchRouter = express.Router();

const searchController = require("../controllers/search.controller");
const auth = require("../middlewares/auth.middleware");

searchRouter.post('/search_sth', auth, searchController.search_sth); // checked
searchRouter.get('/get_saved_search', auth, searchController.get_saved_search); // checked
searchRouter.post('/del_saved_search', auth, searchController.del_saved_search); // checked
searchRouter.get('/get_list_top_searches', auth, searchController.get_list_top_searches); // checked
searchRouter.get('/search_suggestions', auth, searchController.search_suggestions); // checked

module.exports = searchRouter;