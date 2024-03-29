const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    role: { type: String, required: true },
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: ObjectId, ref: "Document" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
