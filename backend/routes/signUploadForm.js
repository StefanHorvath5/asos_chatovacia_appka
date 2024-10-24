const express = require("express");
const router = express.Router();
const signature = require("../middleware/signUpload");
require("../config/cloudinary");

const { authMiddleware } = require("../middleware/authMiddleware");

const cloudinary = require("cloudinary").v2;
const cloudName = cloudinary.config().cloud_name;
const apiKey = cloudinary.config().api_key;

router.get("/", authMiddleware, (req, res, next) => {
  const sig = signature.signuploadform();
  res.json({
    signature: sig.signature,
    timestamp: sig.timestamp,
    cloudname: cloudName,
    apikey: apiKey,
  });
});

module.exports = router;
