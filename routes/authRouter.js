import { Router } from "express";
import validateBody from "../helpers/validateBody";
import { userAuthSchema } from "../schemas/userSchemas";

const authRouter = Router();

authRouter.post("/register", validateBody(userAuthSchema), signup);

authRouter.post("/login", validateBody(userAuthSchema), signin);
export default authRouter;