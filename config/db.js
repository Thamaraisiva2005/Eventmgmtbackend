const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("YOUR_MONGODB_URL");
  console.log("MongoDB Connected");
};

module.exports = connectDB;
