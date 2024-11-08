import mongoose from "mongoose";

const GameSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    players: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    totalStock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    raiting: {
      type: Number,
      required: true,
      default: 0.0,
    },
    newArrivals: {
      type: Boolean,
      default: false,
    },
    recomended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Game = mongoose.model("Game", GameSchema);
