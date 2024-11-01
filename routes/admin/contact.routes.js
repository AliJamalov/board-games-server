import express from "express";

import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../../controllers/admin/contact.controller.js";

const router = express.Router();

router.get("/", getAllContacts);

router.delete("/:id", deleteContact);

router.patch("/:id", updateContact);

router.post("/", createContact);

export default router;
