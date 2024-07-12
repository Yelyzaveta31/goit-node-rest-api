import User from "../db/models/user";


export const findUser = (filter) => User.findOne(filter);

export const userSignup = (data) => User.create(data);