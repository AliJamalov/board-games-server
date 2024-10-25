import InformPage from "../models/informPage.model.js";

export const getAllInforms = async (req, res) => {
  try {
    const informs = await InformPage.find({});
    res.status(200).json({
      success: true,
      data: informs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getInformById = async (req, res) => {
  try {
    const { code } = req.params;
    const informPage = await InformPage.findOne({ code });
    if (!informPage) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(informPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInform = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedInform = await InformPage.findByIdAndDelete(id);

    if (!deletedInform) {
      return res.status(404).json({
        success: false,
        message: "Inform not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inform deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const updateInform = async (req, res) => {
  const { id } = req.params;
  const { title, description, content, code } = req.body;

  try {
    const updatedInform = await InformPage.findByIdAndUpdate(
      id,
      {
        title,
        description,
        content,
        code,
      },
      { new: true }
    );

    if (!updatedInform) {
      return res.status(404).json({
        success: false,
        message: "Inform not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedInform,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const createInform = async (req, res) => {
  const { title, description, content, code } = req.body;

  try {
    const newInform = new InformPage({
      title,
      description,
      content,
      code,
    });

    await newInform.save();

    res.status(201).json({
      success: true,
      data: newInform,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
