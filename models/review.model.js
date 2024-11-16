import mongoose from "mongoose";

const ProductReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    productId: {
      type: String,
      required: true,
    },

    reviewMessage: {
      type: String,
      required: true,
    },

    reviewValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProductReview", ProductReviewSchema);
