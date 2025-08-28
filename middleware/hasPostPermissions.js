import AppError from "../utils/AppError.js";

const hasPostPermissions = (req, res, next) => {
  const role = req?.user?.role;
  if (role && role !== "user") {
    return next();
  } else {
    return next(AppError.unauthorized("You do not have post permissions"));
  }
};

export default hasPostPermissions;
