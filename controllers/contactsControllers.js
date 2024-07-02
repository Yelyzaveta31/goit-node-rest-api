
import { updateContactSchema } from "../schemas/contactsSchemas.js";
import { listContacts, getContactById, addContact, removeContact, updateContact } from "../services/contactsServices.js";


export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await listContacts();
        res.json(contacts);
    }
    catch(error) {
    next(error);
}
};

export const getOneContact = async (req, res,next ) => {
    try {
        const contact = await getContactById(req.params.id);
        if(!contact) {
            return res.status(404).json({"message": "Not found"})
        }
        res.json(contact);
    }
    catch(error){
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const contact= await removeContact(req.params.id);
        if(!contact) {
            return res.status(404).json({"message": "Not found"});
        }
        res.json(contact);
    }
    catch(error) {
        next(error);
    }
};

export const createContact =  async (req, res, next) => {
    try {
        const {name, email, phone} = req.body;
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    }
    catch(error) {
        next(error);
    }
};

export const updatedContactController = async (req, res, next) => {
    try {
      const { error } = updateContactSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      const updatedContact = await updateContact(req.params.id, req.body);
      if (!updatedContact) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(updatedContact);
    } catch (error) {
      next(error);
    }
  };