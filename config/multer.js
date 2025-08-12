const multer = require("multer"); // to parse form's data we are using multer
const { storage } = require("../cloudConfig.js"); // multer was uploading our file in a folder but now we will upload it on cloudinary.

const upload = multer({ storage });

module.exports = upload;
