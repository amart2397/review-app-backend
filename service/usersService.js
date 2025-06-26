import UsersDao from "../dao/usersDao.js";
import UsersValidator from "../validators/usersValidator.js";
import withErrorHandling from "../utils/withCustomErrorHandling.js";
import bcrypt from "bcrypt";

class UsersService {
  async createUser(inputUserData) {
    return withErrorHandling(async () => {
      const validatedData = await UsersValidator.validateNewUser(inputUserData);
      const hashedPwd = await bcrypt.hash(validatedData.password, 10);
      validatedData.password = hashedPwd;
      const newUserId = await UsersDao.createUser(validatedData);
      return newUserId;
    });
  }

  async getAllUsers() {
    return withErrorHandling(async () => {
      users = await UsersDao.getAllUsers();
      return users;
    });
  }

  async updateUser(inputUserData) {
    return withErrorHandling(async () => {
      const validatedData = await UsersValidator.validateExistingUser(
        inputUserData
      );

      if (validatedData.password) {
        const hashedPwd = await bcrypt.hash(validatedData.password, 10);
        validatedData.password = hashedPwd;
      }

      const oldUser = await UsersDao.findUserById(validatedData.id);
      const mergedUser = { ...oldUser, ...validatedData };
      await UsersDao.updateUser(mergedUser);
    });
  }

  async deleteUser(inputUserData) {}
}

export default UsersService();
