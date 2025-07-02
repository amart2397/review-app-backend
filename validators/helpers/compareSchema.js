import AppError from "../utils/AppError.js";
/**
 * Parses data through a defined schema and returns an error if schema is not followed.
 * @param {Object} schema Schema object defined using zod.
 * @param {object} data Input data for comparing.
 * @return {Object} The parsed data after comparing, or a 400 Error.
 */
const compareSchema = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw AppError.badRequest(
      result.error.issues.map((e) => e.path[0] + " " + e.message).join(", ")
    );
  } else {
    return result.data;
  }
};

export default compareSchema;
