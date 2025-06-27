import UsersDao from "../dao/UsersDao.js";
import UsersValidator from "../validators/UsersValidator.js";
import handleError from "../utils/handleError.js";
import bcrypt from "bcrypt";

class UsersService {
  async getAllUsers() {
    try {
      users = await UsersDao.getAllUsers();
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

  async updateUser(inputUserData) {
    try {
      const validatedData = await UsersValidator.validateUpdateUser(
        inputUserData
      );
      if (validatedData.password) {
        const hashedPwd = await bcrypt.hash(validatedData.password, 10);
        validatedData.password = hashedPwd;
      }
      const oldUser = await UsersDao.findUserById(validatedData.id);
      const mergedUser = { ...oldUser, ...validatedData };
      await UsersDao.updateUser(mergedUser);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteUser(inputUserData) {
    try {
      const validatedData = await UsersValidator.validateDeleteUser(
        inputUserData
      );
      const delUser = await UsersDao.deleteUser(validatedData.id);
      return delUser;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new UsersService();
