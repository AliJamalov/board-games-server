import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.routes.js";
import gameRouter from "./routes/game.routes.js";
import userRouter from "./routes/user.routes.js";

const server = express();

server.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use(express.json());

dotenv.config();

server.use("/api/auth", authRouter);
server.use("/api/games", gameRouter);
server.use("/api/users", userRouter);

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
