import Contact from "../models/contact.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { phone, adress } = req.body;

    if (!phone || !adress) {
      return res
        .status(400)
        .json({ message: "Phone and address are required" });
    }

    const contact = new Contact({
      phone,
      adress,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { phone, adress } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.phone = phone || contact.phone;
      contact.adress = adress || contact.adress;

      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);

    if (result) {
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: error.message });
  }
};
