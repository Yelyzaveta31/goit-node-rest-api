import { Router } from "express";
import validateBody from "../helpers/validateBody.js";
import { emailAuthSchema, subscribtionSchema, userAuthSchema } from "../schemas/userSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import { getCurrentUser, logout, resendVerify, signin, signup, updateAvatar, updateSubscription, verify } from "../controllers/userControllers.js";
import upload from "../middlewares/upload.js";

const authRouter = Router();

authRouter.post("/register", validateBody(userAuthSchema), signup);
authRouter.get("/verify/:verificationCode", verify);
authRouter.post("/verify", validateBody(emailAuthSchema), resendVerify)

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

