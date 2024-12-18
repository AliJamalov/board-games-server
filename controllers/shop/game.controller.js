import { Game } from "../../models/game.model.js";

export const getAllGames = async (req, res) => {
  try {
    const {
      age,
      category,
      players,
      duration,
      page = 1,
      limit,
      sortBy = "price-lowtohigh",
    } = req.query;

    // Filter
    const filter = {};
    if (age) filter.age = age;
    if (players) filter.players = players;
    if (duration) filter.duration = duration;
    if (category) filter.category = category;

    // Sort
    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "name-atoz":
        sort.name = 1;
        break;

      case "name-ztoa":
        sort.name = -1;
        break;

      case "date-newest":
        sort.createdAt = -1;
        break;

      case "date-oldest":
        sort.createdAt = 1;
        break;

      default:
        sort.price = 1;
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [count, games] = await Promise.all([
      Game.countDocuments(filter),
      Game.find(filter).limit(limit).skip(skip).sort(sort),
    ]);

    const pageCount = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems: count,
        pageCount,
        currentPage: page,
        itemsPerPage: limit,
      },
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
    const {
      age,
      category,
      players,
      duration,
      page = 1,
      limit,
      sortBy = "price-lowtohigh",
    } = req.query;

    const filter = { newArrivals: true };
    if (age) filter.age = age;
    if (players) filter.players = players;
    if (duration) filter.duration = duration;
    if (category) filter.category = category;

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "name-atoz":
        sort.name = 1;
        break;
      case "name-ztoa":
        sort.name = -1;
        break;
      case "date-newest":
        sort.createdAt = -1;
        break;
      case "date-oldest":
        sort.createdAt = 1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (isNaN(pageNum) || isNaN(limitNum) || limitNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters.",
      });
    }

    const skip = (pageNum - 1) * limitNum;

    const [count, games] = await Promise.all([
      Game.countDocuments(filter),
      Game.find(filter).limit(limitNum).skip(skip).sort(sort),
    ]);

    const pageCount = Math.ceil(count / limitNum);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems: count,
        pageCount,
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to retrieve new arrivals.",
    });
  }
};

export const getRecomended = async (req, res) => {
  try {
    const {
      age,
      category,
      players,
      duration,
      page = 1,
      limit,
      sortBy = "price-lowtohigh",
    } = req.query;

    const filter = { recomended: true };
    if (age) filter.age = age;
    if (players) filter.players = players;
    if (duration) filter.duration = duration;
    if (category) filter.category = category;

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "name-atoz":
        sort.name = 1;
        break;
      case "name-ztoa":
        sort.name = -1;
        break;
      case "date-newest":
        sort.createdAt = -1;
        break;
      case "date-oldest":
        sort.createdAt = 1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (isNaN(pageNum) || isNaN(limitNum) || limitNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters.",
      });
    }

    const skip = (pageNum - 1) * limitNum;

    const [count, games] = await Promise.all([
      Game.countDocuments(filter),
      Game.find(filter).limit(limitNum).skip(skip).sort(sort),
    ]);

    const pageCount = Math.ceil(count / limitNum);

    res.status(200).json({
      success: true,
      pagination: {
        totalItems: count,
        pageCount,
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
      data: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error. Unable to retrieve recomended.",
    });
  }
};
