const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { getUserFromSession } = require("../middleware/auth").default;

// Apply getUserFromSession middleware to all routes
router.use(getUserFromSession);

// User profile routes
router.get("/profile/:userId", userController.getProfile);
router.get("/dashboard/:userId", userController.getDashboard);

module.exports = router;
