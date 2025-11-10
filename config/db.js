import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Connect to MongoDB with connection options
    await mongoose.connect(process.env.MONGO_URI, {
      // These options help avoid deprecation warnings in Mongoose 8.x
    });
    
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("Please make sure:");
    console.error("1. MONGO_URI is set in your .env file");
    console.error("2. Your MongoDB server is running");
    console.error("3. The connection string is correct");
    process.exit(1);
  }
};

export default connectDB;
