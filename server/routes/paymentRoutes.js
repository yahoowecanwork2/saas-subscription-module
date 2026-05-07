import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  createPayment,
  getSinglePayment,
  paymentHistory,
} from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create", isAuthenticated, createPayment);

paymentRoutes.get("/history", isAuthenticated, paymentHistory);

paymentRoutes.get("/:id", isAuthenticated, getSinglePayment);

export default paymentRoutes;
