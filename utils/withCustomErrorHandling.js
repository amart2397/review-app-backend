import AppError from "./AppError.js";
import handleError from "./handleError.js";

//NOT BEING USED CURRENTLY - WAS CAUSING BUGS, MIGHT REFACTOR LATER TO USE
const withCustomErrorHandling = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AppError) throw err;
    handleError(err);
  }
};

export default withCustomErrorHandling;
