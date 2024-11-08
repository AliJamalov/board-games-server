import express from "express";
import { getUniqueFilters } from "../../controllers/shop/uniqueFilters.controller.js";

const router = express.Router();

router.get("/", getUniqueFilters);

export default router;
