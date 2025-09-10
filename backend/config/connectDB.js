import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//code to chekc if the process dotenv has the mongo db url
if (!process.env.MONGODB_URI) {
  throw new Error("please provide the mongo db url in .env file");
}

// function to connect the database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDB database connected");
  } catch (error) {
    console.log("mongo db connection error", error);
  }
}

//simply here i have export the funtion from here
export default connectDB;
