import Contact from "../db/models/contact";


export const listContacts = async( query = {}) => {
  const { filter = {}, fields = {}, settings = {} } = query;
  const { page, limit } = settings;
  const skip = (page - 1) * limit;
  const data = await Contact.find(filter, fields, { skip, limit });
  const total = await Contact.countDocuments(filter);
return {
  data, total,
};
};

export const getContactById = (filter) => Contact.findOne(filter);

export const removeContact = (filter) => Contact.findByIdAndDelete(filter);

export const addContact = (name, email, phone, favorite, owner) => Contact.create({name, email, phone, favorite, owner});

export const updateContact = (filter, data) => Contact.findByIdAndUpdate(filter, data, {new: true});

export const updateContactStatus = (filter, favorite) => Contact.findByIdAndUpdate(filter, {favorite}, {new: true});