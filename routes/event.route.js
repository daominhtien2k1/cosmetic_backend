const express = require("express");
const eventRouter = express.Router();

const eventsController = require("../controllers/event.controller");
const auth = require("../middlewares/auth.middleware");

eventRouter.get("/get_list_events", auth, eventsController.get_list_events);
eventRouter.get("/get_event/:id", auth, eventsController.get_event);

module.exports = eventRouter;