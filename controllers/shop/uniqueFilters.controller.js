import { Game } from "../../models/game.model.js";

export const getUniqueFilters = async (req, res) => {
  try {
    const uniqueAges = (await Game.distinct("age"))
      .filter((age) => age !== null && age !== "" && age !== undefined)
      .sort((a, b) => parseInt(a) - parseInt(b));

    const uniqueDurations = (await Game.distinct("duration"))
      .filter(
        (duration) =>
          duration !== null && duration !== "" && duration !== undefined
      )
      .sort((a, b) => parseInt(a) - parseInt(b));

    const uniquePlayers = (await Game.distinct("players"))
      .filter(
        (players) => players !== null && players !== "" && players !== undefined
      )
      .sort((a, b) => parseInt(a) - parseInt(b));

    res.json({
      ageFilters: uniqueAges,
      durationFilters: uniqueDurations,
      playersFilters: uniquePlayers,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching filters" });
  }
};
