import { User } from "../models/User.js";

const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);

    if (!user.subscription) {
      return res.status(403).json({
        success: false,
        message: "No active subscription",
      });
    }

    const today = new Date();

    // AUTO EXPIRE

    if (user.subscription.endDate < today) {
      user.subscription.status = "expired";

      await user.save();

      return res.status(403).json({
        success: false,
        message: "Subscription expired",
      });
    }

    // CANCELLED

    if (user.subscription.status === "cancelled") {
      return res.status(403).json({
        success: false,
        message: "Subscription cancelled",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Subscription check failed",
    });
  }
};

export default checkSubscription;
