import { Router } from "express";
import validateBody from "../helpers/validateBody";
import { subscribtionSchema, userAuthSchema } from "../schemas/userSchemas";
import { authenticate } from "../middlewares/authenticate";
import { getCurrentUser, updateSubscription } from "../controllers/userControllers";

const authRouter = Router();

authRouter.post("/register", validateBody(userAuthSchema), signup);

authRouter.post("/login", validateBody(userAuthSchema), signin);
authRouter.get("/current", authenticate, getCurrentUser);

authRouter.patch(
    "/", authenticate, validateBody(subscribtionSchema), updateSubscription
);

authRouter.post("/logout", authenticate, logout);

export default authRouter;

