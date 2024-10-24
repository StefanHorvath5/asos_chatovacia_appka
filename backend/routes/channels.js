const express = require("express");
const router = express.Router();

const {
  createChannel
} = require("../controllers/channels");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/createChannel", authMiddleware, createChannel);

module.exports = router;
