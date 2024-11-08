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

    console.log("Received order data:", req.body);

    // Создаем запрос для создания заказа на PayPal
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
              value: item.price.toFixed(2),
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

    console.log(
      "PayPal order request body:",
      JSON.stringify(request.requestBody, null, 2)
    );

    // Создаем заказ через PayPal API
    const order = await client().execute(request);
    console.log("Full PayPal order response:", order); // Логируем весь ответ

    if (!order || !order.result) {
      console.error("PayPal response is undefined or missing result:", order);
      return res.status(500).json({
        success: false,
        message: "PayPal response is undefined or missing result",
        error: order,
      });
    }

    if (!order.result.links) {
      console.error(
        "PayPal response does not contain expected links:",
        order.result
      );
      return res.status(500).json({
        success: false,
        message: "PayPal response does not contain expected links",
        error: order.result,
      });
    }

    const approvalURL = order.result.links.find(
      (link) => link.rel === "approve"
    )?.href;

    if (!approvalURL) {
      console.error("Approval URL not found in PayPal response:", order.result);
      return res.status(500).json({
        success: false,
        message: "Approval URL not found in PayPal response",
        error: order.result,
      });
    }

    console.log("Approval URL:", approvalURL);

    // Логируем сохранение заказа в базу данных
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
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
    });

    console.log("New order object to be saved:", newlyCreatedOrder);

    try {
      await newlyCreatedOrder.save();
      console.log("Order saved successfully:", newlyCreatedOrder);
      return res.status(201).json({
        success: true,
        approvalURL,
        orderId: newlyCreatedOrder._id,
      });
    } catch (saveError) {
      console.error("Error saving order:", saveError);
      return res.status(500).json({
        success: false,
        message: "Error saving order to the database",
        error: saveError.message,
      });
    }
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
    // Извлекаем параметры из query
    const { paymentId, payerId, orderId } = req.query;

    // Логируем полученные параметры
    console.log("Received parameters:", { paymentId, payerId, orderId });

    // Проверка на наличие всех необходимых данных
    if (!paymentId || !payerId || !orderId) {
      console.log("Missing paymentId, payerId, or orderId");
      return res.status(400).json({
        success: false,
        message: "Missing paymentId, payerId, or orderId",
      });
    }

    // Находим заказ по orderId
    let order = await Order.findById(orderId);
    console.log("Found order:", order);

    if (!order) {
      console.log("Order not found with ID:", orderId);
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // Проверка, был ли уже захвачен платеж
    if (order.paymentStatus === "paid") {
      console.log("Order already captured and paid");
      return res.status(400).json({
        success: false,
        message: "Payment already captured for this order",
      });
    }

    // Выполняем запрос на PayPal для захвата платежа
    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    // Здесь можно передать параметры, если это необходимо для запроса
    // request.requestBody({});

    console.log("Executing PayPal capture request with paymentId:", paymentId);
    const captureResponse = await client().execute(request);

    console.log("PayPal capture response:", captureResponse);

    // Проверяем статус захвата
    if (captureResponse.result.status !== "COMPLETED") {
      console.log(
        "Payment capture failed with status:",
        captureResponse.result.status
      );
      return res.status(400).json({
        success: false,
        message: "Payment capture failed",
      });
    }

    // Обновляем статус заказа после успешного платежа
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    // Логируем изменения в статусе заказа
    console.log("Updated order status:", order);

    // Обновляем количество на складе
    for (let item of order.cartItems) {
      let product = await Game.findById(item.productId);

      console.log("Checking product stock for productId:", item.productId);

      if (!product) {
        console.log("Product not found:", item.productId);
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      product.totalStock -= item.quantity; // Уменьшаем количество на складе

      console.log("Updated product stock for product:", product.name);
      await product.save();
    }

    // Удаляем корзину после подтверждения заказа
    const getCartId = order.cartId;
    console.log("Deleting cart with cartId:", getCartId);
    await Cart.findByIdAndDelete(getCartId);

    // Сохраняем изменения в заказе
    await order.save();
    console.log("Order saved:", order);

    // Отправляем ответ клиенту
    res.status(200).json({
      success: true,
      message: "Order confirmed and payment captured",
      data: order,
    });
  } catch (e) {
    console.error("Error occurred during payment capture:", e);

    // Уточняем, если ошибка приходит от PayPal
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
    const { id } = req.params;

    const order = await Order.findById(id);

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
