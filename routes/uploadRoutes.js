const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../config/multer");
const { checkAuth } = require("../middleware/auth").default;

// Upload routes
router.post("/", checkAuth, upload.single("image"), uploadController.uploadFile);

module.exports = router;
