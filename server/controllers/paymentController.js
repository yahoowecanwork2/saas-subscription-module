import Payment from "../models/Payment.js";

import { Subscription } from "../models/Subscription.js";

export const createPayment = async (req, res) => {
  try {
    const { subscriptionId, amount, paymentMethod } = req.body;

    const payment = await Payment.create({
      userId: req.id,

      subscriptionId,

      amount,

      paymentGateway: paymentMethod || "manual",

      paymentId: "PAY_" + Date.now(),

      transactionId: "TXN_" + Date.now(),

      status: "success",

      paidAt: new Date(),
    });

    // ======================================
    // UPDATE SUBSCRIPTION
    // ======================================

    await Subscription.findByIdAndUpdate(subscriptionId, {
      paymentStatus: "paid",
    });

    res.status(201).json({
      success: true,

      message: "Payment successful",

      payment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Payment failed",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                             PAYMENT HISTORY                                */
/* -------------------------------------------------------------------------- */

export const paymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.id,
    })
      .populate("subscriptionId")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      totalPayments: payments.length,
      payments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                            SINGLE PAYMENT                                  */
/* -------------------------------------------------------------------------- */

export const getSinglePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("subscriptionId")
    .populate("userId");

  if (!payment) {
    return res.status(404).json({
      success: false,

      message: "Payment not found",
    });
  }

  res.status(200).json({
    success: true,

    payment,
  });
};
