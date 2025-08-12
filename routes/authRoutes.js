const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { getUserFromSession } = require("../middleware/auth").default;

// Apply getUserFromSession middleware to all routes
router.use(getUserFromSession);

// GET routes
router.get("/signup", authController.getSignup);
router.get("/login", authController.getLogin);
router.get("/logout", authController.logout);

// POST routes
router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);

module.exports = router;
