import express from "express";
import { searchProducts } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/:keyword", searchProducts);

export default router;
