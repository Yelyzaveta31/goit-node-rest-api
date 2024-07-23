
import initMongodbConnection from "./db/initMongodbConnection.js";
import startServer from "./server.js";


const bootsrap = async() => {
  await initMongodbConnection();
startServer();
};

bootsrap();