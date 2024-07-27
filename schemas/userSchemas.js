import Joi from "joi";
import { emailRegex } from "../constants/user-constants.js";

export const userAuthSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

export const emailAuthSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
  });
  

export const subscribtionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  });