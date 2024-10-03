import mongoose from "mongoose";
import dotenv from "dotenv";

async function connectDB() {
    const client= mongoose.connect(process.env.MongoURL)
    try{
        await client;
        console.log('Connected to the database');
    }
    catch(err){
        console.log('Error connecting to the database');
    }
}

export default connectDB;