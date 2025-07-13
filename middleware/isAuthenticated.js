import AppError from "../utils/AppError.js";

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return next(AppError.unauthorized("Not logged in"));
  }
};

export default isAuthenticated;
