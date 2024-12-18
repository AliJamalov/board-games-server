import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios"; // Для отправки запросов

// Routes
import authRouter from "./routes/auth/auth.routes.js";
import gameRouter from "./routes/shop/game.routes.js";
import userRouter from "./routes/admin/user.routes.js";
import categoryRouter from "./routes/admin/category.routes.js";
import contactRouter from "./routes/admin/contact.routes.js";
import faqRouter from "./routes/admin/faq.routes.js";
import informRouter from "./routes/admin/informPage.routes.js";
import orderAdminRouter from "./routes/admin/order.routes.js";
import searchRouter from "./routes/shop/search.routes.js";
import cartRouter from "./routes/shop/cart.routes.js";
import wishListRouter from "./routes/shop/wishList.routes.js";
import reviewRouter from "./routes/shop/review.routes.js";
import filtersRouter from "./routes/shop/uniqueFilters.routes.js";
import addressRouter from "./routes/shop/address.routes.js";
import orderRouter from "./routes/shop/order.routes.js";

const server = express();

server.use(
  cors({
    origin: ["http://localhost:5173", "https://board-games-kappa.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

server.use(cookieParser());
server.use(express.json());

dotenv.config();

// admin routes
server.use("/api/users", userRouter);
server.use("/api/contacts", contactRouter);
server.use("/api/faq", faqRouter);
server.use("/api/informs", informRouter);
server.use("/api/admin/orders", orderAdminRouter);

// client routes
server.use("/api/auth", authRouter);
server.use("/api/games", gameRouter);
server.use("/api/categories", categoryRouter);
server.use("/api/search", searchRouter);
server.use("/api/cart", cartRouter);
server.use("/api/wish-list", wishListRouter);
server.use("/api/product-review", reviewRouter);
server.use("/api/filters", filtersRouter);
server.use("/api/address", addressRouter);
server.use("/api/orders", orderRouter);

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

// Периодический пинг для поддержания активности
const SERVER_URL = "https://board-games-server-sz9k.onrender.com/api";
const PING_INTERVAL = 5 * 60 * 1000; // Интервал в миллисекундах (5 минут)

const pingServer = async () => {
  try {
    const response = await axios.get(SERVER_URL);
    console.log(`Ping successful: ${response.status} - ${response.statusText}`);
  } catch (error) {
    console.error(`Ping failed: ${error.message}`);
  }
};

// Запускаем периодические пинги
setInterval(pingServer, PING_INTERVAL);

server.listen(PORT, () => {
  console.log(`Server listeinig on ${PORT}`);
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });
