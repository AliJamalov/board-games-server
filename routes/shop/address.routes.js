import express from "express";

import {
  fetchAllAddress,
  addAddress,
  editAddress,
  deleteAddress,
} from "../../controllers/shop/address.controller.js";

const router = express.Router();

router.post("/", addAddress);

router.get("/:userId", fetchAllAddress);

router.delete("/:userId/:addressId", deleteAddress);

router.patch("/:userId/:addressId", editAddress);

export default router;
