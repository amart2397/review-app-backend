import { describe, expect, jest } from "@jest/globals";
import AppError from "../utils/AppError.js";

//Mock Modules
jest.unstable_mockModule("../dao/UsersDao.js", () => ({
  default: {
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
}));
jest.unstable_mockModule("../validators/UsersValidator.js", () => ({
  default: {
    validateNewUser: jest.fn(),
    validateUpdateUser: jest.fn(),
    validateDeleteUser: jest.fn(),
  },
}));
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
  },
}));
jest.unstable_mockModule("../utils/handleError.js", () => ({
  default: jest.fn(),
}));
const UsersDaoModule = await import("../dao/UsersDao.js");
const UsersValidatorModule = await import("../validators/UsersValidator.js");
const bcryptModule = await import("bcrypt");
const UsersServiceModule = await import("../service/UsersService.js");
const handleErrorModule = await import("../utils/handleError.js");
const UsersDao = UsersDaoModule.default;
const UsersValidator = UsersValidatorModule.default;
const bcrypt = bcryptModule.default;
const UsersService = UsersServiceModule.default;
const handleError = handleErrorModule.default;

//Mock Data
const mockUsers = [
  {
    id: 1,
    email: "test1@test.com",
    first_name: "FName1",
    last_name: "LName1",
    role: "user",
  },
  {
    id: 2,
    email: "test2@test.com",
    first_name: "FName2",
    last_name: "LName2",
    role: "user",
  },
];
const inputNew = {
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
};
const validatedNew = {
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
};
const newId = 10;
const inputExisting = {
  id: 1,
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
  role: "user",
};
const validatedExisting = {
  id: 1,
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
  role: "user",
};
const hashedPwd = "hashed";
const outputExisting = {
  id: 1,
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
  role: "user",
};
const outputDelete = {
  id: 1,
  email: "test@test.com",
};

//Tests
describe("UsersService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("calls UsersDao to retrieve all user data", async () => {
      UsersDao.getAllUsers.mockResolvedValue(mockUsers);

      const users = await UsersService.getAllUsers();

      expect(UsersDao.getAllUsers).toHaveBeenCalled();
      expect(users).toEqual(mockUsers);
    });
  });

  describe("createUser", () => {
    it("takes user input and inserts into users table after validating", async () => {
      UsersValidator.validateNewUser.mockResolvedValue(validatedNew);
      bcrypt.hash.mockResolvedValue(hashedPwd);
      UsersDao.createUser.mockResolvedValue(newId);

      const newUserId = await UsersService.createUser(inputNew);

      expect(UsersValidator.validateNewUser).toHaveBeenCalledWith(inputNew);
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(validatedNew.password).toEqual(hashedPwd);
      expect(UsersDao.createUser).toHaveBeenCalledWith(validatedNew);
      expect(newUserId).toEqual(newId);
    });
  });

  describe("getUserById", () => {
    it("finds a specifc user by user id", async () => {
      UsersDao.getUserById.mockResolvedValue(outputExisting);

      const user = await UsersService.getUserById(inputExisting);

      expect(UsersDao.getUserById).toHaveBeenCalledWith(inputExisting);
      expect(user).toEqual(outputExisting);
    });
  });

  describe("updateUser", () => {
    it("updates existing user's information based on input after data validation", async () => {
      UsersValidator.validateUpdateUser.mockResolvedValue(validatedExisting);
      bcrypt.hash.mockResolvedValue(hashedPwd);

      await UsersService.updateUser(inputExisting);

      expect(UsersValidator.validateUpdateUser).toHaveBeenCalledWith(
        inputExisting
      );
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(UsersDao.updateUser).toHaveBeenCalledWith(validatedExisting);
      expect(validatedExisting.password).toEqual(hashedPwd);
      expect(UsersDao.updateUser).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteUser", () => {
    it("delets input user information after data validation", async () => {
      UsersValidator.validateDeleteUser.mockResolvedValue(validatedExisting);
      UsersDao.deleteUser.mockResolvedValue(outputDelete);

      const delUser = await UsersService.deleteUser(inputExisting);

      expect(UsersValidator.validateDeleteUser).toHaveBeenCalledWith(
        inputExisting
      );
      expect(UsersDao.deleteUser).toHaveBeenCalledWith(validatedExisting);
      expect(delUser).toEqual(outputDelete);
    });
  });
});

describe("UsersService errors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers error", () => {
    it("recieves an error from db query and runs it through handleError", async () => {
      const dbError = new Error("Database Failure");
      const handledError = new AppError("DB Failure");
      UsersDao.getAllUsers.mockRejectedValue(dbError);
      handleError.mockImplementation(() => {
        throw handledError;
      });

      await expect(UsersService.getAllUsers()).rejects.toThrow(handledError);
      expect(handleError).toHaveBeenCalledWith(dbError);
    });
  });

  describe("createUser error", () => {
    it("recieves an AppError from UsersValidator and doesn't call handleError", async () => {
      const validateError = new AppError("Validation Error");
      UsersValidator.validateNewUser.mockRejectedValue(validateError);

      await expect(UsersService.createUser(inputNew)).rejects.toThrow(
        validateError
      );
      expect(handleError).not.toHaveBeenCalled();
    });
  });
});
