import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { findUser, userSignup } from "../services/userServices.js";

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await userSignup({ ...req.body, password: hashedPass });

    res.status(201).json({
      status: 201,
      message: "Created",
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordVerification = await bcrypt.compare(password, user.password);
    if (!passwordVerification) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = "1213.3431.23323";

    res.json({
      status: 200,
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};