// remove token from header and cookies and cek role then move to next
import { Admin } from "../models/Admin.js";
import jwt from "jsonwebtoken";

// check role === admin
const checkAdmin = async (req, res, next) => {
  try {
    // console.log(req.cookies)
    // console.log(req.cookies.token)
    // console.log(req.cookies.role)
    let token = req.cookies?.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    const admin = await Admin.findById(decode.userId);
    // console.log(admin)
    // console.log(decode)
    if (admin.authenticated) {
      req.id = decode.userId;
      next();
    } else {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default checkAdmin;
