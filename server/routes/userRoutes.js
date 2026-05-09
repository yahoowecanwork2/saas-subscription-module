import express from "express";

import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  forgotPasswordUser,
  getUserForHeader,
  logoutUser,
  resetPasswordUser,
  userLogin,
  userRegister,
  userRegisterOtpResend,
  verifyUser,
} from "../controllers/userController.js";

const userRoutes = express.Router();

// --------------------------- user apis ---------------------------
userRoutes.post("/register", userRegister);
userRoutes.post("/resend-otp", userRegisterOtpResend);
userRoutes.post("/verify", verifyUser);
// send user limited detail during login
userRoutes.post("/login", userLogin);
userRoutes.post("/forgot-passowrd", forgotPasswordUser);
userRoutes.post("/reset-password", resetPasswordUser);
userRoutes.post("/logout", logoutUser);
userRoutes.get("/header-detail", isAuthenticated, getUserForHeader);

export default userRoutes;
