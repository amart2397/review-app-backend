import * as z from "zod/v4";
import UsersDao from "../dao/usersDao";
import AppError from "../utils/AppError";

const userInput = z.object({
  email: z.email(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  password: z.string().min(8),
});

const userModel = userInput.extend({
  id: z.int(),
  role: z.enum(["user", "poster", "admin"]),
});

class UsersValidator {
  //schema validation (using zod)
  validateNewUserSchema(inputData) {
    const result = userInput.safeParse(inputData);
    if (!result.success) {
      throw AppError.badRequest(
        err.issues
          .map((e) => {
            e.path[0] + " " + e.message;
          })
          .join(", ")
      );
    } else {
      return result.data;
    }
  }

  validateExistingUserSchema(inputData) {
    const result = userModel.safeParse(inputData);
    if (!result.success) {
      throw AppError.badRequest(
        err.issues
          .map((e) => {
            e.path[0] + " " + e.message;
          })
          .join(", ")
      );
    } else {
      return result.data;
    }
  }

  //app logic validation
  async validateNewUser(inputData) {
    /*TODO:
        -Check if user email is unique
     */
    const existingUser = await UsersDao.findByEmail(inputData.email);

    if (existingUser.length !== 0) {
      throw AppError.badRequest("Email already registered"); //throw error up all the way to controller layer
    }

    return inputData;
  }
}

export default UsersValidator();
