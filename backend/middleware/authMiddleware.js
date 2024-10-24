const { createCustomError } = require("../errors/customError");
const passport = require("passport");

const authMiddleware = (req, res, next) => {
  passport.authenticate("user-rule", { session: false }, (err, user, info) => {
    if (info && info.name == "TokenExpiredError") {
      return next(createCustomError(`You have been logged out 3`, 401));
    }
    if (!user) {
      return next(createCustomError(`Unauthorized 1`, 401));
    }
    res.user = user;
    next();
  })(req, res, next);
};


module.exports = {
  authMiddleware
};
