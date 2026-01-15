import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

// 👇 Important: collection name
export const adminDataModel = mongoose.model("admins", adminSchema);
