import AppError from "./AppError.js";
import env from "dotenv";

env.config();

const handleError = (err) => {
  switch (err.code) {
    case "ECONNREFUSED":
    case "ENOTFOUND":
    case "ETIMEDOUT":
      throw AppError.internal("Database is unreachable");
    case "23505":
      throw AppError.conflict("Duplicate entry.");
    case "23503":
      throw AppError.badRequest("Invalid foreign key reference.");
    case "23502":
      throw AppError.badRequest("Missing required field.");
    case "22001":
      throw AppError.badRequest("Input too long for field.");
    default:
      throw err;
  }
};

export default handleError;
