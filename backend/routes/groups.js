const express = require("express");
const router = express.Router();

const {
  createGroup,
  getAllGroups,
  addToGroup,
  getGroupById
} = require("../controllers/groups");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");

router.post("/createGroup", authMiddleware, createGroup);
router.post("/addToGroup", authMiddleware, addToGroup);
router.get("/getAllGroups", authMiddleware, getAllGroups);
router.get("/:id", authMiddleware, getGroupById);

module.exports = router;
