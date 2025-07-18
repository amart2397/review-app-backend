import { logEvents } from "../../middleware/logger.js";
import AppError from "../../utils/AppError.js";
/**
 * Parses data through a defined schema and returns an error if schema is not followed.
 * @param {Object} schema Schema object defined using zod.
 * @param {object} data Input data for comparing.
 * @param {Boolean} safe determine if errors throw, or get ignored.
 * @return {Object} The parsed data after comparing, or a 400 Error.
 */
const compareSchema = (schema, data, safe = false) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.issues
      .map((e) => e.path[0] + " " + e.message)
      .join(", ");
    if (!safe) {
      throw AppError.badRequest(errorMessage);
    } else {
      logEvents(errorMessage, "validationErrLog.log");
      return data;
      3;
    }
  } else {
    return result.data;
  }
};

export default compareSchema;
