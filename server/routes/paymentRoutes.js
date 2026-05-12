import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";

import {
  createOrder,
  verifyPayment,
  paymentHistory,
  getSinglePayment,
} from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", isAuthenticated, createOrder);

paymentRoutes.post("/verify", isAuthenticated, verifyPayment);

paymentRoutes.get("/history", isAuthenticated, paymentHistory);

paymentRoutes.get("/:id", isAuthenticated, getSinglePayment);

export default paymentRoutes;
