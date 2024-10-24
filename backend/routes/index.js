const router = require("express").Router();

router.use("/users", require("./users"));
router.use("/groups", require("./groups"));
router.use("/channels", require("./channels"));
router.use("/api/signuploadform", require("./signUploadForm"));

module.exports = router;
