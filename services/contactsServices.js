import Contact from "../models/Contact.js";

export const listContacts = async () => {
  return await Contact.find({});
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId);
};

export const addContact = async (name, email, phone) => {
  return await Contact.create({ name, email, phone });
};

export const updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const updateStatusContact = async (id, favorite) => {
  return await Contact.findByIdAndUpdate(id, { favorite }, { new: true });
};
