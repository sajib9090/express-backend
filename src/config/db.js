import mongoose from "mongoose";
import { mongoDB_uri } from "../../secrets.js";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB_uri, {
      dbName: "user-management",
    });
    console.log("Pinged! MongoDB connected successfully!");
    mongoose.connection.on("error", (err) => {
      console.log("Could not connect to MongoDB", err);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
