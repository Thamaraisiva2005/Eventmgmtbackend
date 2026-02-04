const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// 🔐 Import security middleware
const { verifyToken, isAdmin } = require("./authRoutes");



/* ================= ADD EVENT (ADMIN ONLY) ================= */
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const newEvent = new Event({ title, description, date, location });
    await newEvent.save();

    res.json({ msg: "Event added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add event" });
  }
});


/* ================= GET EVENTS (LOGGED USERS) ================= */
router.get("/", verifyToken, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch events" });
  }
});


/* ================= DELETE EVENT (ADMIN ONLY) ================= */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.json({ msg: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Delete failed" });
  }
});


/* ================= UPDATE EVENT (ADMIN ONLY) ================= */
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location },
      { new: true }
    );

    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.json({ msg: "Event updated successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
});

module.exports = router;
