import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updatedContactController,
  editFavoriteStatus,
} from "../controllers/contactsControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import { createContactSchema, editFavoriteSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id",validateBody(updateContactSchema), updatedContactController);



contactsRouter.patch(
  "/:id/favorite",
  validateBody(editFavoriteSchema),
  editFavoriteStatus
);

export default contactsRouter;