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

    console.log("Received review data:", {
      productId,
      userId,
      reviewMessage,
      reviewValue,
    });

    // Проверка на существующий отзыв
    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      console.log("User has already reviewed this product.");
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // Создание нового отзыва
    const newReview = new ProductReview({
      productId,
      userId,
      username,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();
    console.log("New review saved:", newReview);

    // Получение всех отзывов для расчета среднего рейтинга
    const reviews = await ProductReview.find({ productId });
    console.log("All reviews for product:", reviews);

    const totalReviewsLength = reviews.length;
    console.log("Total number of reviews:", totalReviewsLength);

    const totalRating = reviews.reduce(
      (sum, reviewItem) => sum + reviewItem.reviewValue,
      0
    );
    console.log("Sum of all review ratings:", totalRating);

    const raiting = Math.round(totalRating / totalReviewsLength);
    console.log("Calculated rating:", raiting);

    // Обновление рейтинга продукта
    await Game.findByIdAndUpdate(productId, { raiting });
    console.log("Updated product rating in database:", { productId, raiting });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.error("Error adding product review:", e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
