import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Faq", FaqSchema);
