import paypal from "@paypal/checkout-server-sdk";
import client from "../../helper/paypal.js";
import Cart from "../../models/cart.model.js";
import { Game } from "../../models/game.model.js";
import Order from "../../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.name,
            sku: item.productId,
            unit_amount: {
              currency_code: "USD",
              value: (item.salePrice > 0 ? item.salePrice : item.price).toFixed(
                2
              ),
            },
            quantity: item.quantity,
          })),
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/paypal-return",
        cancel_url: "http://localhost:5173/paypal-cancel",
      },
    });

    const order = await client().execute(request);

    if (!order || !order.result) {
      return res.status(500).json({
        success: false,
        message: "PayPal response is undefined or missing result",
        error: order,
      });
    }

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus: "pending",
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    return res.status(201).json({
      success: true,
      approvalURL: order.result.links.find((link) => link.rel === "approve")
        ?.href,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error("Error in createOrder function:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
      error: e.message,
    });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.query;

    if (!paymentId || !payerId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing paymentId, payerId, or orderId",
      });
    }

    let order = await Order.findById(orderId);

    if (!order) {
      console.log("Order not found:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already captured for this order",
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(paymentId);

    const captureResponse = await client().execute(request);

    if (captureResponse.result.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Payment capture failed",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Game.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;

    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed and payment captured",
      data: order,
    });
  } catch (e) {
    console.error("Error in capturing payment:", e);

    if (e.response && e.response.data) {
      console.error("PayPal error details:", e.response.data);
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while capturing payment",
    });
  }
};

export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
