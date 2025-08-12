const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const { getUserFromSession, checkAuth } = require("../middleware/auth").default;
const upload = require("../config/multer");

// Apply getUserFromSession middleware to all routes
router.use(getUserFromSession);

// GET routes
router.get("/new", checkAuth, listingController.getNewListing);
router.get("/:id", listingController.getListingById);

// POST routes
router.post("/", upload.single("image"), listingController.createListing);

// DELETE routes
router.delete("/:id", listingController.deleteListing);

module.exports = router;
