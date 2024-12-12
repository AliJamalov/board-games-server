import ProductReview from "../../models/review.model.js";
import { Game } from "../../models/game.model.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { productId, userId, username, reviewMessage, reviewValue } =
      req.body;

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      username,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const reviews = await ProductReview.find({ productId });

    const totalReviewsLength = reviews.length;

    const totalRating = reviews.reduce(
      (sum, reviewItem) => sum + reviewItem.reviewValue,
      0
    );

    const raiting = Math.round(totalRating / totalReviewsLength);

    await Game.findByIdAndUpdate(productId, { raiting });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
