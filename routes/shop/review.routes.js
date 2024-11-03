import express from "express";

import {
  getProductReviews,
  addProductReview,
} from "../../controllers/shop/review.controller.js";

const router = express.Router();

router.get("/:productId", getProductReviews);

router.post("/", addProductReview);

export default router;
