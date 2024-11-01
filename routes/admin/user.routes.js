import express from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from "../../controllers/admin/user.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

router.post("/", createUser);

export default router;
