const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: [6, "Too Short"],
      maxlength: [12, "Too big"],
      uppercase: true, //abcf -> ABCF
      required: "Name is required",
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    applied: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
