import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import { findUser, updateUser, userSignup } from "../services/userServices.js";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;
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
    const verificationCode = nanoid();

    const newUser = await userSignup({ ...req.body,avatarURL, password: hashedPass, verificationCode});

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`,
};
await sendEmail(verifyEmail);

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

export const verify = async (req, res, next) => {
  const {verificationCode} = req.params;
  const user = await findUser({ verificationCode });
  
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await updateUser({ _id: user._id }, { verify: true, verificationCode: "" });

  res.json({
    message: "Verification successful",
  });
}

export const resendVerify = async (req, res, next) => {
  const { email } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email already verified");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email resend success",
  });
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUser({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
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

    const updatedUser = await updateUser({ _id }, { avatarURL });

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

    const avatarURL = path.join("avatars", filename).replace(/\\/g, "/");

    const updatedUser = await updateUser({ _id }, { avatarU });
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