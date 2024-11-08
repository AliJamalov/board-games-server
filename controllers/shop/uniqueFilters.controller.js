import { Game } from "../../models/game.model.js";

export const getUniqueFilters = async (req, res) => {
  try {
    const uniqueAges = (await Game.distinct("age")).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
    const uniqueDurations = (await Game.distinct("duration")).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
    const uniquePlayers = (await Game.distinct("players")).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    res.json({
      ageFilters: uniqueAges,
      durationFilters: uniqueDurations,
      playersFilters: uniquePlayers,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching filters" });
  }
};
