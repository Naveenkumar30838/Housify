const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Booking routes
router.get("/:id", bookingController.bookListing);

module.exports = router;
