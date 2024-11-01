import Faq from "../../models/faq.model.js";

export const createFaq = async (req, res) => {
  const { title, description } = req.body;

  try {
    const newFaq = new Faq({
      title,
      description,
    });

    const savedFaq = await newFaq.save();
    res.status(201).json(savedFaq);
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const getFaqById = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await Faq.findById(id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const deleteFaq = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};
