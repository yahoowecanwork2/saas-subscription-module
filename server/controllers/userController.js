import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendRegisterAndResendOtpMail from "../middleware/sendMail.js";
import { generateUserId } from "../utils/idGenerate.js";
import {
  sendMailtoAdmin,
  sendMailtoUser,
  sendVerifyUser,
} from "../middleware/notifyMail.js";
import { generateToken } from "../utils/generateUserToken.js";
import { User } from "../models/User.js";

//-------------------------------------- user apis ----------------------------------
// register user
export const userRegister = async (req, res) => {
  console.log("user register function call");
  try {
    const { email, password } = req.body;
    // console.log(email,password)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const user = {
      email,
      password: hashedpassword,
    };
    const otp = Math.floor(Math.random() * 1000000);
    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.ACTIVATION_SECRET,
      {
        expiresIn: "5m",
      },
    );
    const data = {
      otp,
      userType: "User",
    };
    await sendRegisterAndResendOtpMail(
      email,
      `${process.env.APPLICATION_NAME}`,
      data,
    );
    res.status(201).json({
      status: "success",
      success: true,
      message: "Otp send to your mail successfully",
      token: activationToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const userRegisterOtpResend = async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const user = {
      email,
      password: hashedpassword,
    };
    const otp = Math.floor(Math.random() * 1000000);
    const activationToken = jwt.sign(
      {
        user,
        otp,
      },
      process.env.ACTIVATION_SECRET,
      {
        expiresIn: "5m",
      },
    );
    const data = {
      otp,
      userType: "User",
    };
    await sendRegisterAndResendOtpMail(
      email,
      `${process.env.APPLICATION_NAME}`,
      data,
    );
    res.status(201).json({
      status: "success",
      success: true,
      message: "Otp send to your mail successfully",
      token: activationToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

// verify otp and create admin user in database
export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;
    const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    if (!verify)
      return res.status(400).json({
        message: "Otp Expired",
      });
    if (verify.otp !== Number(otp))
      return res.status(400).json({
        message: "Wrong OTP",
      });
    const name = "student";
    const userId = await generateUserId(verify.user.email, name);
    const user = await User.create({
      userId: userId,
      email: verify.user.email,
      password: verify.user.password,
    });
    await sendVerifyUser(verify.user.email, "Registered successfully", userId);
    // sent token after register
    await generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify",
    });
  }
};

// login user and generate token
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect User email",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    await generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export const forgotPasswordUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "No User with this email",
      });
    const token = jwt.sign({ email }, process.env.Forgot_Secret);
    const data = { name: user.name, email, token };
    await sendForgotMail("Study material", data);
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Reset password send to your mail",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Send password reset link on email",
    });
  }
};

export const resetPasswordUser = async (req, res) => {
  try {
    const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);
    const user = await User.findOne({ email: decodedData.email });
    if (!user)
      return res.status(404).json({
        message: "No user with this email",
      });

    if (user.resetPasswordExpire === null)
      return res.status(404).json({
        message: "Token Expired",
      });

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        message: "Token Expired",
      });
    }
    const password = await bcrypt.hash(req.body.password, 10);
    user.password = password;
    user.resetPasswordExpire = null;
    await user.save();
    res.json({ message: "Password Reset" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};
// only for header
export const getUserForHeader = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select(
      "-password -address -role -cart -wishlist -suggestedProjects -suggestedProjects -viewedProducts -viewedProjects -allow -seenNotifications -unseenNotifications -studyDetail",
    );
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    const unSeenNotification = user?.unseenNotifications?.length || 0;
    const wishlist = user?.wishlist?.length || 0;
    const cart = user?.cart?.length || 0;
    return res.status(200).json({
      success: true,
      user,
      message: "User header detail fetched success fully",
      unSeenNotification,
      wishlist,
      cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select(
      "-password -seenNotifications -unseenNotifications -wishlist -cart",
    );
    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Profile fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};
