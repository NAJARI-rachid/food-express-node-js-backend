import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
