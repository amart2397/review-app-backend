import AppError from "../utils/AppError.js";

const isAdmin = (req, res, next) => {
  const role = req?.user?.role;
  if (role === "admin") {
    return next();
  } else {
    return next(AppError.unauthorized("Not an admin"));
  }
};

export default isAdmin;
