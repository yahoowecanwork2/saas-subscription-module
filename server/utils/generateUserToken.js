import jwt from "jsonwebtoken";
import { sendLoginMailtoUser } from "../middleware/notifyMail.js";

// this function take user id and and and make token of it
export const generateToken = async (res, user, message) => {
  try {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    console.log(user);
    const email = user?.email;
    const data = {
      email: email,
      name: user.name,
      message: `You Login to subscription-module application`,
    };
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  } catch (error) {
    console.error("Error generating token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error generating token" });
  }
};
