import mongoose from "mongoose";


const initMongodbConnection = async () => {
    try{
        const DB_HOST = "mongodb+srv://Yelyzaveta_31:Didenko31081997@cluster0.uvpn0im.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");
    }
    catch(error){
        console.log(`Connection error ${err.message}`);
        process.exit(1);
    }
}


export default initMongodbConnection;