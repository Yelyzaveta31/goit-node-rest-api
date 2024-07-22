import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import errorHandler from "./middlewares/errorHandlers.js";

import notFoundHandler from "./middlewares/notFoundHandler.js";

import env from "./helpers/env.js";
import authRouter from "./routes/authRouter.js";


const startServer = () => {
  const port = Number(env("PORT", 3000));
  const app = express();

  app.use(morgan("tiny"));

  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));

  app.use("/api/users", authRouter);
  app.use("/api/contacts", contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
};

export default startServer;