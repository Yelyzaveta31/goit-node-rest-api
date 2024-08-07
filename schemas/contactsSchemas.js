
import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
  }).min(1).messages({
    'object.min': 'Body must have at least one field',
    'string.email': 'Invalid email format'
  });

  
export const editFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
