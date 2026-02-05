const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE BOOKING
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const totalPrice = tickets * event.price;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      tickets,
      totalPrice
    });

    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

module.exports = router;
