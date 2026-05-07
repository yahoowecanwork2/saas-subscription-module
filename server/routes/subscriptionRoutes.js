import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  buySubscription,
  cancelSubscription,
  getMySubscription,
  renewSubscription,
  subscriptionHistory,
} from "../controllers/subscriptionController.js";

const subscriptioRouters = express.Router();

subscriptioRouters.post("/buy", isAuthenticated, buySubscription);

subscriptioRouters.post("/renew", isAuthenticated, renewSubscription);

subscriptioRouters.get("/my", isAuthenticated, getMySubscription);

subscriptioRouters.post("/cancel", isAuthenticated, cancelSubscription);

subscriptioRouters.get("/history", isAuthenticated, subscriptionHistory);

export default subscriptioRouters;
