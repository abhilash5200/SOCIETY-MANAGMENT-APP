import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed", err);
    process.exit(1);
  }
};