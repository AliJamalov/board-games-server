import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.routes.js";
import gameRouter from "./routes/game.routes.js";
import userRouter from "./routes/user.routes.js";
import categoryRouter from "./routes/category.routes.js";
import contactRouter from "./routes/contact.routes.js";
import faqRouter from "./routes/faq.routes.js";
import informRouter from "./routes/informPage.routes.js";
import searchRouter from "./routes/search.routes.js";

const server = express();

server.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use(express.json());

dotenv.config();

server.use("/api/auth", authRouter);
server.use("/api/games", gameRouter);
server.use("/api/users", userRouter);
server.use("/api/categories", categoryRouter);
server.use("/api/contacts", contactRouter);
server.use("/api/faq", faqRouter);
server.use("/api/informs", informRouter);
server.use("/api/search", searchRouter);

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

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
