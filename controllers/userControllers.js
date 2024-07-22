import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { findUser, updateUser, userSignup } from "../services/userServices.js";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");


export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const user = await findUser({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await userSignup({ ...req.body,avatarURL, password: hashedPass });

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

export const updateAvatar = async (req, res, next) => {
  try {
    const { path: oldPath, filename } = req.file;
    const { _id } = req.user;
    
    const image = await Jimp.read(oldPath);
    image.resize(250, 250);
    await image.writeAsync(oldPath);

    const newPath = path.join(avatarsPath, filename)
    await fs.rename(oldPath, newPath);

    const avatar = path.join("avatars", filename).replace(/\\/g, "/");

    const updatedUser = await updateUser({ _id }, { avatar });
    if (!updatedUser) {
      return next(HttpError(404, "User not found"));
    }

    res.json({
      status: 200,
      message: "Avatar updated successfully!",
      data: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
        avatarURL: updatedUser.avatarURL,
      },
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    next(error);
  }
};