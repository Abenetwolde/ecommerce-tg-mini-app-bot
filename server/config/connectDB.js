import mongoose from "mongoose";
import dotenv from 'dotenv'
import ProductModel from "../models/product.model.js";
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connect DB")
        await ProductModel.syncIndexes();
        console.log('Indexes synced successfully.');
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}

export default connectDB