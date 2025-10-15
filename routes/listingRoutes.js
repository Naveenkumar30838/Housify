const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const { getUserFromSession, checkAuth } = require("../middleware/auth").default;
const upload = require("../config/multer");
const reviewController = require("../controllers/reviewController");

// Apply getUserFromSession middleware to all routes
router.use(getUserFromSession);

// GET routes
router.get("/new", checkAuth, listingController.getNewListing);
router.get("/:id/edit", checkAuth, listingController.getEditListing);
router.get("/:id", listingController.getListingById);

// POST routes
router.post("/:id/review", checkAuth, reviewController.createReview);
router.post("/", upload.single("image"), listingController.createListing);

// PUT routes
router.put("/:id", checkAuth, listingController.updateListing);

// DELETE routes
router.delete("/:id", listingController.deleteListing);

module.exports = router;
