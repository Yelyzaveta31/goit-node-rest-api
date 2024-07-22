import { Router } from "express";
import validateBody from "../helpers/validateBody";
import { subscribtionSchema, userAuthSchema } from "../schemas/userSchemas";
import { authenticate } from "../middlewares/authenticate";
import { getCurrentUser, logout, signin, signup, updateAvatar, updateSubscription } from "../controllers/userControllers";
import upload from "../middlewares/upload.js";

const authRouter = Router();

authRouter.post("/register", validateBody(userAuthSchema), signup);

authRouter.post("/login", validateBody(userAuthSchema), signin);
authRouter.get("/current", authenticate, getCurrentUser);

authRouter.patch(
    "/", authenticate, validateBody(subscribtionSchema), updateSubscription
);

authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    updateAvatar
  );

  
authRouter.post("/logout", authenticate, logout);

export default authRouter

