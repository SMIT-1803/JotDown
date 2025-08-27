import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { app } from "../app.js";

async function connnectDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Process with running app: ", error);
    });
    console.log("MongoDB connected successfully!!");
  } catch (error) {
    console.log("MongoDB connection FAILED: ", error);
    process.exit(1);
  }
}

export default connnectDB;
