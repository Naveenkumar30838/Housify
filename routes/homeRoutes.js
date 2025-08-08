const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { getUserFromSession } = require("../middleware/auth");

// Apply getUserFromSession middleware to all routes
router.use(getUserFromSession);

// Home page
router.get("/", homeController.getHome);

// Filter properties
router.get("/filter", homeController.filterProperties);

// Search properties
router.get("/search", homeController.searchProperties);

module.exports = router;
