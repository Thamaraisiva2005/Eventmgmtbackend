const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User"); // 👈 ADD THIS

const app = express();
app.get("/", (req, res) => {
  res.send("Backend working da machi 🚀");
});


/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes.router);


/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // 👑 AUTO SET ADMIN ROLE (RUNS ON SERVER START)
    const adminEmail = "thamaraisiva29@gmail.com";
    const user = await User.findOne({ email: adminEmail });

    if (user && user.role !== "admin") {
      user.role = "admin";
      await user.save();
      console.log("✅ Admin role assigned");
    } else if (!user) {
      console.log("⚠ Admin email not found in DB");
    } else {
      console.log("ℹ Admin already set");
    }
  })
  .catch(err => console.log(err));

/* Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
