import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneno: {
      type: String,
    },
    alternateno: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      default: {},
    },
    // add date,price,timeperiod (2 year) in object
    previousSubscriptions: {
      type: [Object],
      default: [],
    },
    currentSubscription: {
      type: Object,
      default: null,
    },
    allow: {
      type: String,
      default: "no",
      enum: ["no", "yes"],
    },
    authenticated: {
      type: String,
      required: false,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Admin = mongoose.model("Admin", adminSchema);
