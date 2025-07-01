import AppError from "./AppError.js";
import handleError from "./handleError.js";

//NOT BEING USED CURRENTLY - WAS CAUSING BUGS, MIGHT REFACTOR LATER TO USE
const withCustomErrorHandling = async (fn) => {
  try {
    return await fn(); //This is what was causing bugs...I need this to be a function wrapper that doesn't call the input function immediately..
  } catch (err) {
    if (err instanceof AppError) throw err;
    handleError(err);
  }
};

export default withCustomErrorHandling;
