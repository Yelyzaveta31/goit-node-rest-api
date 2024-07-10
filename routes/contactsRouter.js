import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updatedContactController,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import createContactSchema, { editFavoriteSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { updateStatusContact } from "../services/contactsServices.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id",validateBody(updateContactSchema), updatedContactController);

contactsRouter.patch("/:id/favorite", validateBody(editFavoriteSchema), updateStatusContact);

export default contactsRouter;