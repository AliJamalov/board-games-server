import express from "express";

import {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../../controllers/shop/cart.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:userId", getCartItems);

router.post("/", authMiddleware, addToCart);

router.patch("/", updateCartItem);

router.delete("/:userId/:productId", deleteCartItem);

export default router;
