const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = require("../config/multer");
const { checkAuthForUpload } = require("../middleware/auth");

// Upload routes
router.post("/", checkAuthForUpload, upload.single("image"), uploadController.uploadFile);

module.exports = router;
