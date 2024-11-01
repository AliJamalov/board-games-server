import express from "express";
import {
  register,
  login,
  logOut,
  forgotPassword,
  resetPassword,
} from "../../controllers/auth/auth.controller.js";

const router = express.Router();

router.post("/sign-up", register);

router.post("/sign-in", login);

router.post("/log-out", logOut);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
