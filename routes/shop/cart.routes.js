import express from "express";

import {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../../controllers/shop/cart.controller.js";

const router = express.Router();

router.get("/", getCartItems);

router.post("/", addToCart);

router.patch("/", updateCartItem);

router.delete("/:userId/:productId", deleteCartItem);

export default router;
