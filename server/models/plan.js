import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "free"],
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    features: [
      {
        type: String,
      },
    ],

    isFreeTrial: {
      type: Boolean,
      default: false,
    },

    trialDays: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Plan = mongoose.model("Plan", planSchema);

export default Plan;
