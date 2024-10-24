const express = require("express");
const router = express.Router();

const { register, login, getUser } = require("../controllers/users");

const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/getUser", authMiddleware, getUser);

module.exports = router;
