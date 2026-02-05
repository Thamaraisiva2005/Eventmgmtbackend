const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");

const app = express();

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);


/* 🌍 CORS CONFIG (VERY IMPORTANT) */
app.use(cors({
  origin: "*", // allow all (you can restrict later)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* 📦 MIDDLEWARE */
app.use(express.json());

/* 🏠 TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Backend working da machi 🚀");
});

/* 🔐 AUTH ROUTES */
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes.router);

/* 📅 EVENT ROUTES */
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

/* 🗄️ DATABASE CONNECTION */
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // 👑 AUTO-SET ADMIN ROLE
    const adminEmail = "thamaraisiva29@gmail.com";
    const user = await User.findOne({ email: adminEmail });

    if (user && user.role !== "admin") {
      user.role = "admin";
      await user.save();
      console.log("👑 Admin role assigned");
    } else if (!user) {
      console.log("⚠ Admin email not found in DB");
    } else {
      console.log("ℹ Admin already set");
    }
  })
  .catch(err => console.log("❌ DB Error:", err));

/* 🚀 SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
