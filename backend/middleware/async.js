const { createCustomError } = require("../errors/customError");

const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (error.code === 11000) {
          return next(createCustomError(`Unique fields validation error`, 403));
      } else if (error.name === "ValidationError") {
        return next(createCustomError(error.message, 403));
      }
      next(error);
    }
  };
};

const asyncWrapperNormalFuctions = (fn, errorReturn) => {
  return async (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      return errorReturn;
    }
  };
};

module.exports = { asyncWrapper, asyncWrapperNormalFuctions };
