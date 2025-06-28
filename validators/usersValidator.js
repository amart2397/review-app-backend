import * as z from "zod/v4";
import UsersDao from "../dao/UsersDao.js";
import AppError from "../utils/AppError.js";
import compareSchema from "./compareSchema.js";

//Data schemas
const newUserSchema = z.object({
  email: z.email(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  password: z.string().min(8),
});

const updateUserSchema = z.object({
  id: z.int(),
  email: z.email(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  password: z.string().min(8).optional(),
  role: z.enum(["user", "poster", "admin"]).optional(),
});

const userIdSchema = z.object({
  id: z.int(),
});

class UsersValidator {
  //schema validation (using zod)
  validateNewUserSchema(inputUserData) {
    return compareSchema(newUserSchema, inputUserData);
  }

  validateUserIdSchema(inputUserData) {
    return compareSchema(userIdSchema, inputUserData);
  }

  validateUpdateUserSchema(inputUserData) {
    return compareSchema(updateUserSchema, inputUserData);
  }

  //app logic validation
  async validateNewUser(inputUserData) {
    const existingUser = await UsersDao.findFullUserByEmail(
      inputUserData.email
    );
    if (existingUser) {
      throw AppError.conflict("Email already registered");
    }
    return inputUserData;
  }

  async validateUpdateUser(inputUserData) {
    const existingUserByEmail = await UsersDao.findFullUserByEmail(
      inputUserData.email
    );
    if (existingUserByEmail && existingUserByEmail?.id !== inputUserData.id) {
      throw AppError.conflict("Email already registered");
    }
    const existingUserById = await UsersDao.findFullUserById(inputUserData.id);
    if (!existingUserById) {
      throw AppError.badRequest("User not found");
    }
    return inputUserData;
  }

  async validateDeleteUser(inputUserData) {
    const existingUserById = await UsersDao.findFullUserById(inputUserData.id);
    if (!existingUserById) {
      throw AppError.badRequest("User not found");
    }
    return inputUserData;
  }
}

export default new UsersValidator();
