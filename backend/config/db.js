const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    // Check if MONGO_URI is missing or contains the placeholder 'xxxxx'
    if (!mongoURI || mongoURI.includes("xxxxx")) {
      console.warn(
        "⚠️  Warning: MONGO_URI is missing or contains a placeholder.",
      );
      console.warn(
        "   Falling back to local MongoDB: mongodb://localhost:27017/inventory-supply-chain",
      );
      mongoURI = "mongodb://localhost:27017/inventory-supply-chain";
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error(
      "\n💡 Tip: If you don't have MongoDB Atlas, set MONGO_URI=mongodb://localhost:27017/inventory-supply-chain in your .env file (requires local MongoDB running).",
    );
    process.exit(1);
  }
};

module.exports = connectDB;
