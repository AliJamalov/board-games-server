import express from "express";
import {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
} from "../controllers/faq.controller.js";

const router = express.Router();

router.post("/", createFaq);
router.get("/", getAllFaqs);
router.get("/:id", getFaqById);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router;
