import { Game } from "../models/game.model.js";

export const searchProducts = async (req, res) => {
  const { keyword } = req.params;
  try {
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }
    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [{ name: regEx }, { description: regEx }],
    };

    const searchResults = await Game.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
