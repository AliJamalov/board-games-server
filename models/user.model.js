import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: {
    type: String,
    default: null, // Начальное значение
  },
  resetPasswordExpiry: {
    type: Date,
    default: null, // Начальное значение
  },
});

export const User = mongoose.model("User", UserSchema);
