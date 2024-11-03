import express from "express";

import {
  getWishListItems,
  addToWishList,
  deleteWishItems,
} from "../../controllers/shop/wishList.controller.js";

const router = express.Router();

router.get("/:userId", getWishListItems);

router.post("/", addToWishList);

router.delete("/:userId/:productId", deleteWishItems);

export default router;
