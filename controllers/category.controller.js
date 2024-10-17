import Category from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const categories = await Category.findById(req.params.id);

    if (categories) {
      res.json(categories);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const category = new Category({
      name,
      imageUrl,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.imageUrl = imageUrl || category.imageUrl;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);

    if (result) {
      res.json({ message: "Category deleted!" });
    } else {
      res.status(404).json({ message: "Category not found!" });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
  }
};
