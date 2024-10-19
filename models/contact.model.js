import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Contact", ContactSchema);
