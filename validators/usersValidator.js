import * as z from "zod/v4";
import UsersDao from "../dao/usersDao.js";
import AppError from "../utils/AppError.js";
import compareSchema from "./compareSchema.js";

//Data schemas
const newUserSchema = z.object({
  email: z.email(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  password: z.string().min(8),
});

const existingUserSchema = z.object({
  id: z.int(),
  ...newUserSchema,
  password: z.string().min(8).optional(),
  role: z.enum(["user", "poster", "admin"]),
});

class UsersValidator {
  //schema validation (using zod)
  validateNewUserSchema(inputUserData) {
    return compareSchema(newUserSchema, inputUserData);
  }

  validateExistingUserSchema(inputUserData) {
    return compareSchema(existingUserSchema, inputUserData);
  }

  //app logic validation
  async validateNewUser(inputUserData) {
    const existingUser = await UsersDao.findUserByEmail(inputUserData.email);

    if (existingUser) {
      throw AppError.conflict("Email already registered");
    }

    return inputUserData;
  }

  async validateExistingUser(inputUserData) {
    const existingUserByEmail = await UsersDao.findUserByEmail(
      inputUserData.email
    );

    if (existingUserByEmail && existingUserByEmail?.id !== inputUserData.id) {
      throw AppError.conflict("Email already registered");
    }

    const existingUserById = await UsersDao.findUserById(inputUserData.id);

    if (!existingUserById) {
      throw AppError.badRequest("User not found");
    }

    return inputUserData;
  }
}

export default UsersValidator();
