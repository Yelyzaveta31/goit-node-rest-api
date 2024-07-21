import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { findUser, userSignup } from "../services/userServices.js";



const { JWT_SECRET } = process.env;

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
    const { _id: id } = user;

    const payload = { id };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    await updateUser({ _id: id }, { token: accessToken });

    res.json({
      status: 200,
      accessToken,
      refreshToken,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
  const { email, subscription } = req.user;
  res.json({
    status: 200,
    message: "User retrieved successfully",
    user: { email, subscription },
  });
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;

    await updateUser({ _id }, { token: null });

    res.status(204).end();
  } catch (error) {
    next(HttpError(401, "Not Authorized"));
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;

    const updatedUser = await updateUser({ _id }, { subscription });

    if (!updatedUser) {
      return next(HttpError(404, "User not found"));
    }

    res.json({
      status: 200,
      message: "Subscription updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};