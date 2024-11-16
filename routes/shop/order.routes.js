import express from "express";

import {
  getAllOrdersByUser,
  createOrder,
  capturePayment,
  getOrderDetails,
} from "../../controllers/shop/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);

router.get("/capture", capturePayment);

router.get("/list/:userId", getAllOrdersByUser);

router.get("/details/:orderId", getOrderDetails);

export default router;
