import mongoose from "mongoose";

const WishListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WishList", WishListSchema);
