import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(">>>>> DB connected");
  } catch (error) {
    console.error("Error connecting to database: ", error.message);
  }
}
