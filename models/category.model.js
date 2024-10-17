import mongoose from "mongoose"

const CategorytSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  
      },
      imageUrl:{
        type: String,
        required: true,
       }
});

export default mongoose.model("Category", CategorytSchema);