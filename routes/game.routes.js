import express from "express";

import {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getNewArrivals,
  getRecomended,
} from "../controllers/game.controller.js";

const router = express.Router();

router.get("/", getAllGames);

router.get("/:id", getGameById);

router.post("/", createGame);

router.patch("/:id", updateGame);

router.delete("/:id", deleteGame);

router.get("/new-arrivals", getNewArrivals);

router.get("/recomended", getRecomended);

export default router;
