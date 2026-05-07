import mongoose from "mongoose";

const Schema = mongoose.Schema;

/* -------------------------------------------------------------------------- */
/*                               CART SCHEMA                                  */
/* -------------------------------------------------------------------------- */

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    slug: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                            WISHLIST SCHEMA                                 */
/* -------------------------------------------------------------------------- */

const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    slug: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                          SUBSCRIPTION SCHEMA                               */
/* -------------------------------------------------------------------------- */

const subscriptionSchema = new mongoose.Schema(
  {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },

    planName: {
      type: String,
      default: "",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "free"],
      default: "free",
    },

    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "expired",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    remainingDays: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

/* -------------------------------------------------------------------------- */
/*                                USER SCHEMA                                 */
/* -------------------------------------------------------------------------- */

const UserSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneno: {
      type: String,
      unique: true,
      sparse: true,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    address: {
      locality: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      pinCode: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },
    },

    /* ----------------------------- SUBSCRIPTION ---------------------------- */

    subscription: {
      type: subscriptionSchema,
      default: () => ({}),
    },

    /* -------------------------------- CART -------------------------------- */

    cart: [cartItemSchema],

    /* ------------------------------ WISHLIST ------------------------------ */

    wishlist: [wishlistItemSchema],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);

export default User;
