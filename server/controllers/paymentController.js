import crypto from "crypto";

import Payment from "../models/Payment.js";

import { Subscription } from "../models/Subscription.js";

import { instance } from "../app/app.js";

// ======================================================
// CREATE RAZORPAY ORDER
// ======================================================

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Number(amount * 100),

      currency: "INR",

      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to create order",
    });
  }
};

// ======================================================
// VERIFY PAYMENT
// ======================================================

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      subscriptionId,

      amount,
    } = req.body;

    // ============================================
    // GENERATE SIGNATURE
    // ============================================

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    // ============================================
    // VERIFY SIGNATURE
    // ============================================

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,

        message: "Payment verification failed",
      });
    }

    // ============================================
    // SAVE PAYMENT
    // ============================================

    const payment = await Payment.create({
      userId: req.id,

      subscriptionId,

      amount,

      paymentGateway: "razorpay",

      paymentId: razorpay_payment_id,

      orderId: razorpay_order_id,

      transactionId: "TXN_" + Date.now(),

      status: "success",

      paidAt: new Date(),
    });

    // ============================================
    // UPDATE SUBSCRIPTION
    // ============================================

    await Subscription.findByIdAndUpdate(subscriptionId, {
      paymentStatus: "paid",
    });

    res.status(200).json({
      success: true,

      message: "Payment verified successfully",

      payment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Payment verification failed",
    });
  }
};

// ======================================================
// PAYMENT HISTORY
// ======================================================

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

// ======================================================
// SINGLE PAYMENT
// ======================================================

export const getSinglePayment = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch payment",
    });
  }
};
