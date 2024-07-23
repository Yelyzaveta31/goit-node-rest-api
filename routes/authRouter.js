import { Router } from "express";
import validateBody from "../helpers/validateBody.js";
import { subscribtionSchema, userAuthSchema } from "../schemas/userSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import { getCurrentUser, logout, signin, signup, updateAvatar, updateSubscription } from "../controllers/userControllers.js";
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

