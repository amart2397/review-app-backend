import { jest } from "@jest/globals";

//Mock Modules
jest.unstable_mockModule("../db/db.js", () => ({
  default: jest.fn(),
}));
jest.unstable_mockModule("../dao/transformData.js", () => ({
  transformUserData: jest.fn(),
}));
const db = await import("../db/db.js");
const { transformUserData } = await import("../dao/transformData.js");
const UsersDaoModule = await import("../dao/UsersDao.js");
const UsersDao = UsersDaoModule.default;
const dbMock = db.default;

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
const inputExisting = {
  id: 1,
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
  role: "poster",
};
const transformedExisting = {
  id: 1,
  email: "test@test.com",
  first_name: "Fname",
  last_name: "Lname",
  password: "password",
  role: "poster",
};
const transformedNew = {
  email: "test@test.com",
  first_name: "Fname",
  last_name: "Lname",
  password: "password",
};
const outputExisting = {
  id: 1,
  email: "test@test.com",
  firstName: "Fname",
  lastName: "Lname",
  password: "password",
};
const outputDelete = {
  id: 1,
  email: "test@test.com",
};
const newId = 10;

describe("UsersDao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Tests
  describe("getAllUsers", () => {
    it("calls db with desired columns and returns users list", async () => {
      const selectMock = jest.fn().mockResolvedValue(mockUsers);
      dbMock.mockImplementation(() => ({
        select: selectMock,
      }));

      const users = await UsersDao.getAllUsers();

      expect(users).toEqual(mockUsers);
      expect(dbMock).toHaveBeenCalledWith("users");
      expect(selectMock).toHaveBeenCalledWith(
        expect.not.arrayContaining(["password"])
      );
    });
  });

  describe("createUser", () => {
    it("calls transformUserData with input and inserts transformed data into users table", async () => {
      transformUserData.mockReturnValue(transformedNew);

      const returningMock = jest.fn().mockResolvedValue([{ id: newId }]);
      const insertMock = jest.fn(() => ({
        returning: returningMock,
      }));
      dbMock.mockImplementation(() => ({
        insert: insertMock,
      }));

      const id = await UsersDao.createUser(inputNew);

      expect(transformUserData).toHaveBeenCalledWith(inputNew);
      expect(dbMock).toHaveBeenCalledWith("users");
      expect(insertMock).toHaveBeenCalledWith(transformedNew);
      expect(returningMock).toHaveBeenCalledWith("id");
      expect(id).toEqual(newId);
    });
  });

  describe("getUserById", () => {
    it("Extracts id from input data then retrieves desired columns from users table for input id", async () => {
      const whereMock = jest.fn().mockResolvedValue(outputExisting);
      const firstMock = jest.fn(() => ({
        where: whereMock,
      }));
      dbMock.mockImplementation(() => ({
        first: firstMock,
      }));

      const user = await UsersDao.getUserById(inputExisting);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(firstMock).toHaveBeenCalledWith(
        expect.not.arrayContaining(["password"])
      );
      expect(whereMock).toHaveBeenCalledWith("id", inputExisting.id);
      expect(user).toEqual(outputExisting);
    });
  });

  describe("updateUser", () => {
    it("transforms user input data and updates table entry with new data", async () => {
      transformUserData.mockReturnValue(transformedExisting);
      const updateMock = jest.fn();
      const whereMock = jest.fn(() => ({
        update: updateMock,
      }));
      dbMock.mockImplementation(() => ({
        where: whereMock,
      }));

      await UsersDao.updateUser(inputExisting);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(whereMock).toHaveBeenCalledWith("id", transformedExisting.id);
      expect(updateMock).toHaveBeenCalledWith(transformedExisting);
    });
  });

  describe("deleteUser", () => {
    it("extracts id from input and deletes associated user returning the deleted id and email", async () => {
      const delMock = jest.fn().mockResolvedValue([outputDelete]);
      const returningMock = jest.fn(() => ({
        del: delMock,
      }));
      const whereMock = jest.fn(() => ({
        returning: returningMock,
      }));
      dbMock.mockImplementation(() => ({
        where: whereMock,
      }));

      const delUser = await UsersDao.deleteUser(inputExisting);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(whereMock).toHaveBeenCalledWith("id", inputExisting.id);
      expect(returningMock).toHaveBeenCalledWith(["id", "email"]);
      expect(delMock).toHaveBeenCalled();
      expect(delUser).toEqual(outputDelete);
    });
  });

  describe("findFullUserByEmail", () => {
    it("finds a user by email input and returns full table info", async () => {
      const whereMock = jest.fn().mockResolvedValue(outputExisting);
      const firstMock = jest.fn(() => ({
        where: whereMock,
      }));
      dbMock.mockImplementation(() => ({
        first: firstMock,
      }));

      const user = await UsersDao.findFullUserByEmail(inputExisting.email);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(firstMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalledWith("email", inputExisting.email);
      expect(user).toEqual(outputExisting);
    });
  });

  describe("findFullUserById", () => {
    it("finds a user by id input and returns full table info", async () => {
      const whereMock = jest.fn().mockResolvedValue(outputExisting);
      const firstMock = jest.fn(() => ({
        where: whereMock,
      }));
      dbMock.mockImplementation(() => ({
        first: firstMock,
      }));

      const user = await UsersDao.findFullUserById(inputExisting.id);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(firstMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalledWith("id", inputExisting.id);
      expect(user).toEqual(outputExisting);
    });
  });
});

describe("UsersDao errors", () => {
  //Test Error Throws
  describe("createUser errors", () => {
    it("throws an error if db insert fails", async () => {
      const error = new Error("DB Insert Failed");

      transformUserData.mockReturnValue(transformedNew);

      const returningMock = jest.fn().mockRejectedValue(error);
      const insertMock = jest.fn(() => ({
        returning: returningMock,
      }));
      dbMock.mockImplementation(() => ({
        insert: insertMock,
      }));

      await expect(UsersDao.createUser(inputNew)).rejects.toThrow(
        error.message
      );
      expect(returningMock).toHaveBeenCalledWith("id");
      expect(insertMock).toHaveBeenCalledWith(transformedNew);
      expect(dbMock).toHaveBeenCalledWith("users");
    });
  });
});
