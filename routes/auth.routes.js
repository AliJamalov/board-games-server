import express from "express";
import {
  register,
  login,
  logOut,
  forgotPassword,
  resetPassword,
  createAdmin,
} from "../controllers/auth.controller.js";
import { checkAdmin } from "../middlewares/checkAdmin.js";

const router = express.Router();

router.post("/sign-up", register);

router.post("/sign-in", login);

router.post("/log-out", logOut);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/create-admin", checkAdmin, createAdmin);

export default router;
