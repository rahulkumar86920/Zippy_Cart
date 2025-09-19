import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plaese Enter your name "],
    },
    email: {
      type: String,
      required: [true, "Plase the the email id "],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Plase the the password "],
    },
    mobile: {
      type: Number,
      default: null,
    },

    verify_email: {
      type: Boolean,
      default: false,
    },
  
    orderHistory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "ORDER",
      },
    ],

    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("USER", userSchema);
export default UserModel;