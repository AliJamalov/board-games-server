import express from "express";
import {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
} from "../../controllers/admin/faq.controller.js";

const router = express.Router();

router.post("/", createFaq);
router.get("/", getAllFaqs);
router.get("/:id", getFaqById);
router.patch("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router;
