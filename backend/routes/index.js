const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/groups", require("./groups"));

module.exports = router;
