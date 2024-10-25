import express from "express";
import {
  getAllInforms,
  getInformById,
  deleteInform,
  updateInform,
  createInform,
} from "../controllers/informPage.controller.js";

const router = express.Router();

router.get("/", getAllInforms);
router.get("/:code", getInformById);
router.delete("/:id", deleteInform);
router.patch("/:id", updateInform);
router.post("/", createInform);

export default router;
