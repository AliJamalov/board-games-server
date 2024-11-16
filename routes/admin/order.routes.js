import express from "express";
import {
  getAllOrdersOfAllUsers,
  updateOrderStatus,
  deleteOrder,
} from "../../controllers/admin/order.controller.js";

const router = express.Router();

router.get("/", getAllOrdersOfAllUsers);
router.patch("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
