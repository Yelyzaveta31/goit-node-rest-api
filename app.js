import initMongodbConnection from "./db/initMongodbConnection"
import startServer from "./server";


const bootsrap = async() => {
  await initMongodbConnection();
startServer();
};

bootsrap();