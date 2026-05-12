import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import Razorpay from "razorpay";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dbConnect from "../config/dbConfig.js";
import adminRoutes from "../routes/adminRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import plansRoutes from "../routes/plansRoutes.js";
import subscriptioRouters from "../routes/subscriptionRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import homeRoutes from "../routes/homeRoutes.js";

// import productRoutes from "../routes/productRoutes.js";
// import orderRoutes from "../routes/orderRoutes.js";
// import userRoutes from "../routes/userRoutes.js";

dbConnect();
const app = express();
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);

app.use("/api/v1/plan", plansRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/subscription", subscriptioRouters);
app.use("/api/v1/home", homeRoutes);
// app.use("/api/v1/order", orderRoutes);
// app.use("/api/v1/user", userRoutes);

export default app;
