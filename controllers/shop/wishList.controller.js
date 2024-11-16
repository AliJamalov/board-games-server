import WishList from "../../models/wishList.model.js";
import { Game } from "../../models/game.model.js";

export const getWishListItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is mandatory!",
      });
    }

    const wishItems = await WishList.find({ userId }).populate({
      path: "productId",
      select: "images price name",
    });

    if (!wishItems.length) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const validItems = wishItems.filter((item) => item.productId);

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      images: item.productId.images,
      name: item.productId.name,
      price: item.productId.price,
    }));

    res.status(200).json({
      success: true,
      data: populateCartItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving wishlist",
    });
  }
};

export const toggleWishList = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Game.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingWish = await WishList.findOne({ userId, productId });

    if (existingWish) {
      await WishList.deleteOne({ userId, productId });
      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully",
      });
    } else {
      const newWishItem = new WishList({ userId, productId });
      await newWishItem.save();
      return res.status(201).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: newWishItem,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error toggling product in wishlist",
    });
  }
};

export const deleteWishItems = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const wishItem = await WishList.deleteOne({ userId, productId });

    if (!wishItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from wishlist successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error removing item from wishlist",
    });
  }
};
