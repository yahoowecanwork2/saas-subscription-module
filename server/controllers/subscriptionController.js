import { User } from "../models/User.js";

import { Subscription } from "../models/Subscription.js";
import Plan from "../models/plan.js";

/*                           BUY SUBSCRIPTION                                 */

export const buySubscription = async (req, res) => {
  const { planId } = req.body;

  const user = await User.findById(req.id);
  const plan = await Plan.findById(planId);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Plan not found",
    });
  }

  const today = new Date();

  let startDate = today;

  /* ...............IF USER ALREADY HAS ACTIVE SUBSCRIPTION.........*/

  if (
    user.subscription &&
    user.subscription.endDate &&
    user.subscription.endDate > today
  ) {
    startDate = user.subscription.endDate;
  }

  /*........... CALCULATE END DATE ..............................*/
  const finalAmount =
    plan.discountPrice > 0 ? plan.price - plan.discountPrice : plan.price;
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + plan.durationDays);

  /*.......................CALCULATE REMAINING DAYS..............................*/

  const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  /*.............................UPDATE USER SUBSCRIPTION...........................................*/

  user.subscription = {
    planId: plan._id,

    planName: plan.name,

    billingCycle: plan.billingCycle,

    status: "active",

    startDate: today,

    endDate,

    remainingDays,

    amountPaid: finalAmount,
  };

  await user.save();

  /*.......................CREATE SUBSCRIPTION HISTORY........................................ */

  const subscription = await Subscription.create({
    userId: user._id,

    planId: plan._id,

    planName: plan.name,

    billingCycle: plan.billingCycle,

    startDate: today,

    endDate,

    totalDays: plan.durationDays,

    remainingDays,

    amountPaid: finalAmount,
    paymentStatus: "paid",

    status: "active",
  });

  res.status(200).json({
    success: true,

    message: "Subscription activated",

    subscription,
  });
};

/*..............................RENEW SUBSCRIPTION.....................................*/

export const renewSubscription = async (req, res) => {
  const { planId } = req.body;

  const user = await User.findById(req.id);
  const plan = await Plan.findById(planId);

  const today = new Date();

  let startDate = today;

  /*................................IF CURRENT SUBSCRIPTION ACTIVE................................*/

  if (user.subscription && user.subscription.endDate > today) {
    startDate = user.subscription.endDate;
  }

  /*................................. NEW END DATE........................................ */
  const finalAmount =
    plan.discountPrice > 0 ? plan.price - plan.discountPrice : plan.price;
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + plan.durationDays);

  const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  /*..........................UPDATE USER SUBSCRIPTION...................................*/

  user.subscription = {
    planId: plan._id,

    planName: plan.name,

    billingCycle: plan.billingCycle,

    status: "active",

    startDate: today,

    endDate,

    remainingDays,

    amountPaid: finalAmount,
  };

  await user.save();

  /*.....................................CREATE SUBSCRIPTION ENTRY................................*/

  const subscription = await Subscription.create({
    userId: user._id,

    planId: plan._id,

    planName: plan.name,

    billingCycle: plan.billingCycle,

    startDate: today,

    endDate,

    totalDays: plan.durationDays,

    remainingDays,

    amountPaid: plan.price,

    paymentStatus: "paid",

    status: "active",
  });

  res.status(200).json({
    success: true,

    message: "Subscription renewed",

    subscription,
  });
};

export const getMySubscription = async (req, res) => {
  const user = await User.findById(req.id);
  const today = new Date();

  if (user.subscription && user.subscription.endDate < today) {
    user.subscription.status = "expired";

    await user.save();
  }

  res.status(200).json({
    success: true,

    subscription: user.subscription,
  });
};

export const cancelSubscription = async (req, res) => {
  const user = await User.findById(req.id);
  user.subscription.status = "cancelled";

  await user.save();

  res.status(200).json({
    success: true,

    message: "Subscription cancelled",
  });
};

export const subscriptionHistory = async (req, res) => {
  const subscriptions = await Subscription.find({
    userId: req.id,
  })
    .populate("planId")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,

    subscriptions,
  });
};
