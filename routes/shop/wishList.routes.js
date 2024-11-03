import express from "express";

import {
  getWishListItems,
  toggleWishList,
  deleteWishItems,
} from "../../controllers/shop/wishList.controller.js";

const router = express.Router();

router.get("/:userId", getWishListItems);

router.post("/", toggleWishList);

router.delete("/:userId/:productId", deleteWishItems);

export default router;
