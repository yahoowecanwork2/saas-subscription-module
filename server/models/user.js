import mongoose from "mongoose";
const Schema = mongoose.Schema;

// const cartItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Product",
//   },
//   imageUrl: {
//     type: String,
//     default: "",
//   },
//   price: {
//     type: String,
//     default:"",
//   },
//   slug: {
//     type: String,
//     default: "",
//   },
//   name: {
//     type: String,
//     default: "",
//   },
//   description:{
//     type:String,
//     default:""
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   },
// }, { _id: false });
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
      // ✅
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
      type: String,
      default: "",
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

const UserSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      default: "",
    },

    phoneno: {
      type: String,
      required: false,
      unique: true,
    },

    image: {
      type: String,
      default: "",
    },

    address: {
      locality: { type: String, default: "" },
      city: { type: String, default: "" },
      pinCode: { type: String, default: "" },
      state: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
