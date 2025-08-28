import UsersDao from "../dao/usersDao.js";
import UsersValidator from "../validators/usersValidator.js";
import handleError from "../utils/handleError.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";

class UsersService {
  async getAllUsers(cursor = null) {
    try {
      const users = await UsersDao.getAllUsers(cursor);
      return users;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async createUser(inputUserData) {
    try {
      const validatedData = await UsersValidator.validateNewUser(inputUserData);
      const hashedPwd = await bcrypt.hash(validatedData.password, 10);
      validatedData.password = hashedPwd;
      const newUserId = await UsersDao.createUser(validatedData);
      return newUserId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateUser(inputUserData, requestUserId) {
    try {
      const validatedData = await UsersValidator.validateUpdateUser(
        inputUserData
      );
      if (validatedData.id !== requestUserId) {
        throw AppError.forbidden("You are not authorized to modify this user.");
      }
      if (validatedData.password) {
        const hashedPwd = await bcrypt.hash(validatedData.password, 10);
        validatedData.password = hashedPwd;
      }
      await UsersDao.updateUser(validatedData);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteUser(inputUserData, requestUserId) {
    try {
      const validatedData = await UsersValidator.validateDeleteUser(
        inputUserData
      );
      if (validatedData.id !== requestUserId) {
        throw AppError.forbidden("You are not authorized to modify this user.");
      }
      const delUser = await UsersDao.deleteUser(validatedData);
      return delUser;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getUserById(inputUserData) {
    try {
      const { id } = inputUserData;
      const user = await UsersDao.getUserById(id);
      return user;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //Below methods are used by passport for authenticatiing users
  async getUserByEmail(inputUserData) {
    try {
      const { email } = inputUserData;
      const user = await UsersDao.getUserByEmail(email);
      return user;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async verifyUserPassword(inputUserData, password) {
    try {
      const storedPassword = await UsersDao.getUserPassword(inputUserData);
      const match = await bcrypt.compare(password, storedPassword);
      return match;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new UsersService();
