import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateUserToken.js";
import { Admin } from "../models/Admin.js";
import sendRegisterAndResendOtpMail, {
  loginAndresendOtpEmail,
  sendForgotMail,
} from "../middleware/sendMail.js";
import { sendMailtoUser, sendVerifyUser } from "../middleware/notifyMail.js";
// import Order from "../models/Order.js";
import crypto from "crypto";
// import Subscription from "../models/Subscription.js";
// import { razorpay } from "../config/razorpay.js";
// import { renewSubscriptionService } from "../service/subscriptionService.js";

//-------------------------------------- owner apis ----------------------------------

// regester admin
export const adminRegister = async (req, res) => {
  try {
    const { name, email, phoneno, password } = req.body;
    // check user exists
    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exist with this email.",
      });
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    // create the user
    const user = {
      name,
      email,
      phoneno,
      password: hashedpassword,
    };
    const otp = Math.floor(100000 + Math.random() * 900000);

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
      name,
      otp,
    };
    await sendRegisterAndResendOtpMail(
      email,
      "Study material application",
      data,
    );
    res.status(201).json({
      success: true,
      status: "success",
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

export const registerOtpResend = async (req, res) => {
  try {
    const { name, email, phoneno, password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    // create the user
    const user = {
      name,
      email,
      phoneno,
      password: hashedpassword,
    };
    const otp = Math.floor(100000 + Math.random() * 900000);
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
      name,
      otp,
    };
    await sendRegisterAndResendOtpMail(
      email,
      "Study material application",
      data,
    );
    res.status(201).json({
      success: true,
      status: "success",
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

export const verifyAdmin = async (req, res) => {
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

    await Admin.create({
      name: verify.user.name,
      authenticated: true,
      phoneno: verify.user.phoneno,
      email: verify.user.email,
      allow: "no",
      password: verify.user.password,
    });

    await sendVerifyUser(verify.user.email, "Registered successfully");
    return res.status(200).json({
      success: true,
      message: "Registered successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Admin.findOne({ email });
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
      success: true,
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

export const resetPassword = async (req, res) => {
  try {
    console.log(req.query.token);
    const { token, password } = req.body;
    const decodedData = jwt.verify(token, process.env.Forgot_Secret);
    const user = await Admin.findOne({ email: decodedData.email });
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
        success: false,
        message: "Token Expired",
      });
    }
    const newpassword = await bcrypt.hash(password, 10);
    user.password = newpassword;
    user.resetPasswordExpire = null;
    await user.save();
    res.json({
      success: true,
      message: "Password Reset",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// user and admin login same
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required.",
      });
    }
    const existUser = await Admin.findOne({ email });
    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "Incorrect user email",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, existUser.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    const user = {
      name: existUser.name,
      email,
    };
    // ------------------- otp send process start --------------------
    const otp = Math.floor(100000 + Math.random() * 900000);
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
      name: existUser.name,
      otp,
    };
    await loginAndresendOtpEmail(email, "Study material application", data);
    res.status(201).json({
      success: true,
      status: "success",
      message: "Login Otp send to your mail successfully",
      token: activationToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

// login resend otp
export const adminResendLoginVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existUser = await Admin.findOne({ email });
    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "Incorrect user email",
      });
    }
    // create the user
    const user = {
      name: existUser.name,
      email,
    };
    const otp = Math.floor(100000 + Math.random() * 900000);
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
      name: existUser.name,
      otp,
    };
    await loginAndresendOtpEmail(email, "Study material application", data);
    res.status(201).json({
      success: true,
      status: "success",
      message: "Login Otp resend to your mail successfully",
      token: activationToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend otp",
    });
  }
};

// verify login otp and generate token
export const verifyLoginUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;
    // console.log(typeof otp,activationToken);
    const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    // console.log("Verify Otp "+ typeof verify.otp)
    if (!verify)
      return res.status(400).json({
        message: "Otp Expired",
      });
    if (verify.otp !== Number(otp))
      return res.status(400).json({
        message: "Wrong OTP",
      });
    const email = verify.user.email;
    // find user and send user detail in token
    const user = await Admin.findOne({ email }).select(
      "name userId phoneno email photoUrl",
    );
    //  generate token function call
    await generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify",
    });
  }
};

export const logout = async (req, res) => {
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

// give user profile detail
export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await Admin.findById(userId).select("-password");
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

// export const addSubscription = async (req, res) => {
//   try {
//     const userId = req.id;
//     const { price, timePeriod } = req.body;
//     const user = await Admin.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     // create subscription object
//     const newSubscription = {
//       price,
//       timePeriod,
//       date: new Date(),
//     };
//     // move current subscription to previous if exists
//     if (
//       user.currentSubscription &&
//       Object.keys(user.currentSubscription).length > 0
//     ) {
//       user.previousSubscriptions.push(user.currentSubscription);
//     }
//     // update current subscription
//     user.currentSubscription = newSubscription;
//     // allow access
//     user.allow = "yes";
//     await user.save();
//     return res.status(200).json({
//       success: true,
//       message: "Subscription added successfully",
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to add subscription",
//     });
//   }
// };

// export const checkAllow = async (req, res) => {
//   try {
//     const userId = req.id;
//     const user = await Admin.findById(userId).select(
//       "allow currentSubscription",
//     );
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (user.allow === "yes") {
//       return res.status(200).json({
//         success: true,
//         allow: true,
//         message: "Access allowed",
//         subscription: user.currentSubscription,
//       });
//     }
//     return res.status(403).json({
//       success: false,
//       allow: false,
//       message: "Subscription required",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to check access",
//     });
//   }
// };

// export const uploadProfilePic = async (req, res) => {
//   try {
//     const userFound = await Admin.findById(req.id);
//     if (!userFound) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     const updatedUser = await Admin.findByIdAndUpdate(
//       req.id,
//       {
//         photoUrl: `/uploads/${req?.file?.path}` || userFound.image,
//       },
//       { new: true },
//     );
//     res.json({
//       success: true,
//       message: "Profile image uploaded successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to add image in profile",
//     });
//   }
// };

// export const removeProfilePic = async (req, res) => {
//   try {
//     const userFound = await Admin.findById(req.id);
//     if (!userFound) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     rm(userFound.image);
//     const updatedUser = await Admin.findByIdAndUpdate(
//       req.id,
//       {
//         photoUrl: "",
//       },
//       { new: true },
//     );
//     res.json({
//       success: true,
//       message: "Profile image removed successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to remove image",
//     });
//   }
// };

export const adminUpdateProfile = async (req, res) => {
  try {
    const { phoneno, alternateno, address } = req.body;
    const user = await Admin.findById(req.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updateData = {};
    if (phoneno) {
      updateData.phoneno = phoneno;
    }
    if (alternateno) {
      updateData.alternateno = alternateno;
    }
    if (
      address &&
      typeof address === "object" &&
      Object.keys(address).length > 0
    ) {
      updateData.address = address;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.id,
      { $set: updateData },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
    });
  }
};

// send email message to particular user
export const sendEmailToUser = async (req, res) => {
  try {
    const { email, name, subject, message } = req.body;

    if (!subject || !message || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required.",
      });
    }
    await sendMailtoUser(email, subject, name, message);
    return res.status(200).json({
      success: true,
      message: `Emails sent successfully to user.`,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send emails.",
      error: error.message,
    });
  }
};

// export const createSubscription = async (req, res) => {
//   try {
//     const { userId, plan, billingCycle, price } = req.body;

//     const startDate = new Date();
//     let endDate = new Date();

//     if (billingCycle === "monthly") {
//       endDate.setMonth(endDate.getMonth() + 1);
//     }

//     if (billingCycle === "yearly") {
//       endDate.setFullYear(endDate.getFullYear() + 1);
//     }

//     const subscription = await Subscription.create({
//       userId,
//       plan,
//       billingCycle,
//       price,
//       startDate,
//       endDate,
//     });

//     const admin = await Admin.findById(userId);

//     // add subscription to history
//     admin.previousSubscriptions.push(subscription);

//     // update current subscription
//     admin.currentSubscription = subscription;

//     await admin.save();

//     res.status(201).json({
//       success: true,
//       subscription,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const checkSubscription = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const subscription = await Subscription.findOne({ userId });

//     if (!subscription) {
//       return res.json({
//         active: false,
//         message: "No subscription found",
//       });
//     }

//     const now = new Date();

//     if (subscription.endDate < now) {
//       subscription.status = "expired";
//       await subscription.save();

//       return res.json({
//         active: false,
//         message: "Subscription expired",
//       });
//     }

//     res.json({
//       active: true,
//       subscription,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const renewSubscription = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const subscription = await Subscription.findOne({ userId });

//     if (!subscription) {
//       return res.status(404).json({
//         success: false,
//         message: "Subscription not found",
//       });
//     }

//     const admin = await Admin.findById(userId);

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: "Admin not found",
//       });
//     }

//     // calculate new end date
//     let newEndDate = new Date(subscription.endDate);

//     if (subscription.billingCycle === "monthly") {
//       newEndDate.setMonth(newEndDate.getMonth() + 1);
//     }

//     if (subscription.billingCycle === "yearly") {
//       newEndDate.setFullYear(newEndDate.getFullYear() + 1);
//     }

//     // update subscription
//     subscription.endDate = newEndDate;
//     subscription.status = "active";

//     await subscription.save();

//     // add this cycle to billing history
//     admin.previousSubscriptions.push(subscription);

//     // update current subscription
//     admin.currentSubscription = subscription;

//     await admin.save();

//     res.status(200).json({
//       success: true,
//       message: "Subscription renewed successfully",
//       subscription,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const createOrder = async (req, res) => {
//   try {
//     const { amount, userId, plan, billingCycle, price, type } = req.body;

//     // ✅ Validate input
//     if (!amount || !userId || !plan || !billingCycle || !price || !type) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const options = {
//       amount: amount * 100, // ₹ → paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,

//       // 🔥 THIS IS THE HEART OF YOUR FLOW
//       notes: {
//         userId,
//         plan,
//         billingCycle,
//         price,
//         type, // "create" | "renew"
//       },
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("CREATE ORDER ERROR 👉", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;
//     console.log("Line 793 working");

//     // ✅ 1. Verify signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     console.log("Line 801 working");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment verification failed",
//       });
//     }

//     console.log("Line 809 working");

//     // ✅ 2. Fetch order (SOURCE OF TRUTH)
//     const order = await razorpay.orders.fetch(razorpay_order_id);

//     const { userId, plan, billingCycle, price, type } = order.notes;

//     if (!userId || !plan || !billingCycle || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid order metadata",
//       });
//     }
//     console.log("Line 822 working");

//     const normalizedBillingCycle = billingCycle.toLowerCase();

//     let subscription;

//     console.log("Line 828 working");

//     // 🔁 3. RENEW FLOW (using service)
//     if (type === "renew") {
//       subscription = await renewSubscriptionService(
//         userId,
//         razorpay_payment_id,
//       );
//       console.log("Line 838 working");
//     }
//     // 🆕 4. CREATE FLOW
//     else {
//       const startDate = new Date();
//       const endDate = new Date(startDate);

//       if (normalizedBillingCycle === "monthly") {
//         endDate.setMonth(endDate.getMonth() + 1);
//       } else {
//         endDate.setFullYear(endDate.getFullYear() + 1);
//       }

//       subscription = await Subscription.findOneAndUpdate(
//         { userId },
//         {
//           userId,
//           plan,
//           billingCycle: normalizedBillingCycle,
//           price,
//           paymentId: razorpay_payment_id,
//           startDate,
//           endDate,
//           status: "active",
//         },
//         { upsert: true, new: true },
//       );
//     }

//     res.json({
//       success: true,
//       message:
//         type === "renew"
//           ? "Subscription renewed successfully"
//           : "Subscription created successfully",
//       subscription,
//     });
//   } catch (error) {
//     console.error("VERIFY PAYMENT ERROR 👉", error);

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
