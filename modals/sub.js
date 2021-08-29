const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const subSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Too Short"],
      maxlength: [32, "Too big"],
      required: "Name is required",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: ObjectId,
      ref: "Category",
      require: "Category Id is required",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Sub", subSchema);
