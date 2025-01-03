const { CustomAPIError } = require("../errors/customError");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(err.status || 500)
    .json({ msg: "Something went wrong, please try again" });
};
module.exports = errorHandlerMiddleware;
