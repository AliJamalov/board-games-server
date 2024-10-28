import { Game } from "../models/game.model.js";

export const getAllGames = async (req, res) => {
  try {
    const { age, players, duration } = req.query;

    const filter = {};
    if (age) filter.age = age;
    if (players) filter.players = players;
    if (duration) filter.duration = duration;

    const games = await Game.find(filter);

    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to retrieve games.",
    });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const singleGame = await Game.findById(id);

    if (!singleGame) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: singleGame,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to retrieve game.",
    });
  }
};

export const createGame = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      age,
      duration,
      players,
      images,
      totalStock,
      price,
      salePrice,
      raiting,
      newArrivals,
      recomended,
    } = req.body;

    const newGame = new Game({
      name,
      description,
      category,
      age,
      duration,
      players,
      images,
      totalStock,
      price,
      salePrice,
      raiting,
      newArrivals: newArrivals || false,
      recomended: recomended || false,
    });

    await newGame.save();

    res.status(201).json({
      success: true,
      data: newGame,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to create game.",
    });
  }
};

export const updateGame = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    age,
    duration,
    players,
    images,
    totalStock,
    price,
    salePrice,
    raiting,
    newArrivals,
    recomended,
  } = req.body;

  try {
    const updatedGame = await Game.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        age,
        duration,
        players,
        images,
        totalStock,
        price,
        salePrice,
        raiting,
        newArrivals,
        recomended,
      },
      { new: true }
    );

    if (!updatedGame) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found." });
    }

    res.status(200).json({
      success: true,
      data: updatedGame,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to update game.",
    });
  }
};

export const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found." });
    }

    res.status(200).json({
      success: true,
      message: "Game deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to delete game.",
    });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const games = await Game.find({ newArrivals: true });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecomended = async (req, res) => {
  try {
    const games = await Game.find({ recomended: true });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
