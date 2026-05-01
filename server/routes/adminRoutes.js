import express from "express";
import {
  adminLogin,
  adminRegister,
  adminResendLoginVerifyOtp,
  adminUpdateProfile,
  forgotPassword,
  getProfile,
  logout,
  registerOtpResend,
  resetPassword,
  sendEmailToUser,
  verifyAdmin,
  verifyLoginUser,
} from "../controllers/adminController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const adminRoutes = express.Router();

//----------------------------------------- admin routes ------------------------

adminRoutes.post("/register", adminRegister);
adminRoutes.post("/register-resend-otp", registerOtpResend);
adminRoutes.post("/register-otp-verify", verifyAdmin);
adminRoutes.post("/forgotpassword", forgotPassword);
adminRoutes.post("/resetpassword", resetPassword);
adminRoutes.post("/login", adminLogin);
adminRoutes.post("/login-otp-resend", adminResendLoginVerifyOtp);
adminRoutes.post("/login-otp-verify", verifyLoginUser);
adminRoutes.put("/logout", logout);

adminRoutes.get("/profile", isAuthenticated, getProfile);
adminRoutes.put("/profile-update", isAuthenticated, adminUpdateProfile);
adminRoutes.put("/send-mail", isAuthenticated, sendEmailToUser);

export default adminRoutes;
