import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log("✅ Database Connected:", conn.connection.host);

    
    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });
  } catch (error) {
    console.error("❌ Could not connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;