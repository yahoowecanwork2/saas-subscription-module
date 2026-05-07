export const checkSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.subscription) {
    return res.status(403).json({
      message: "No subscription",
    });
  }

  const today = new Date();

  if (today > user.subscription.endDate) {
    user.subscription.status = "expired";

    await user.save();

    return res.status(403).json({
      message: "Subscription expired",
    });
  }

  next();
};
