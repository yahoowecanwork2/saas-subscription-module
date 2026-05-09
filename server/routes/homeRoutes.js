import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import checkSubscription from "../middleware/checkSubscription.js";
const homeRoutes = express.Router();

homeRoutes.get("/home", isAuthenticated, checkSubscription, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to premium home page",
  });
});

export default homeRoutes;
