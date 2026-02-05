const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { verifyToken } = require("./authRoutes"); // adjust path if different

/* 🎟️ BOOK EVENT */
router.post("/book", verifyToken, async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    if (!eventId || !tickets)
      return res.status(400).json({ msg: "Missing booking details" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      tickets
    });

    await booking.save();

    res.status(201).json({ msg: "Booking successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
