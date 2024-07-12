import Joi from "joi";
import { emailRegex } from "../constants/user-constants";

export const userAuthSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});