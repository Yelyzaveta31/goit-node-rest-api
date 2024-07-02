
import Joi from "joi";

export const createContactSchema = Joi.object({

})

export const updateContactSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional()
  }).min(1).messages({
    'object.min': 'Body must have at least one field',
    'string.email': 'Invalid email format'
  });
