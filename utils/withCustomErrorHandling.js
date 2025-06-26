import AppError from "./AppError";
import handleError from "./handleError";

const withCustomErrorHandling = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AppError) throw err;
    handleError(err);
  }
};

export default withCustomErrorHandling;
