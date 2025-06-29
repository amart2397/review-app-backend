import { jest } from "@jest/globals";

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

describe("UsersDao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Test methods
  describe("getAllUsers", () => {
    it("calls db with desired columns and returns users list", async () => {
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
      const input = {
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
      };
      const transformedData = {
        email: "test@test.com",
        first_name: "Fname",
        last_name: "Lname",
        password: "password",
      };
      const mockId = 10;

      transformUserData.mockReturnValue(transformedData);

      const returningMock = jest.fn().mockResolvedValue([{ id: mockId }]);
      const insertMock = jest.fn(() => ({
        returning: returningMock,
      }));
      dbMock.mockImplementation(() => ({
        insert: insertMock,
      }));

      const id = await UsersDao.createUser(input);

      expect(transformUserData).toHaveBeenCalledWith(input);
      expect(dbMock).toHaveBeenCalledWith("users");
      expect(insertMock).toHaveBeenCalledWith(transformedData);
      expect(returningMock).toHaveBeenCalledWith("id");
      expect(id).toEqual(mockId);
    });
  });

  describe("getUserById", () => {
    it("Extracts id from input data then retrieves desired columns from users table for input id", async () => {
      const input = {
        id: 1,
        email: "test@test.com",
      };

      const output = {
        id: 1,
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
      };

      const whereMock = jest.fn().mockResolvedValue(output);
      const firstMock = jest.fn(() => ({
        where: whereMock,
      }));
      dbMock.mockImplementation(() => ({
        first: firstMock,
      }));

      const user = await UsersDao.getUserByID(input);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(firstMock).toHaveBeenCalledWith(
        expect.not.arrayContaining(["password"])
      );
      expect(whereMock).toHaveBeenCalledWith("id", input.id);
      expect(user).toEqual(output);
    });
  });

  describe("updateUser", () => {
    it("transforms user input data and updates table entry with new data", async () => {
      const input = {
        id: 1,
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
        role: "poster",
      };

      const transformedData = {
        id: 1,
        email: "test@test.com",
        first_name: "Fname",
        last_name: "Lname",
        password: "password",
        role: "poster",
      };

      transformUserData.mockReturnValue(transformedData);
      const updateMock = jest.fn();
      const whereMock = jest.fn(() => ({
        update: updateMock,
      }));
      dbMock.mockImplementation(() => ({
        where: whereMock,
      }));

      await UsersDao.updateUser(input);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(whereMock).toHaveBeenCalledWith("id", transformedData.id);
      expect(updateMock).toHaveBeenCalledWith(transformedData);
    });
  });

  describe("deleteUser", () => {
    it("extracts id from input and deletes associated user returning the deleted id and email", async () => {
      const input = {
        id: 1,
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
        role: "poster",
      };

      const output = {
        id: 1,
        email: "test@test.com",
      };

      const delMock = jest.fn().mockResolvedValue([output]);
      const returningMock = jest.fn(() => ({
        del: delMock,
      }));
      const whereMock = jest.fn(() => ({
        returning: returningMock,
      }));
      dbMock.mockImplementation(() => ({
        where: whereMock,
      }));

      const delUser = await UsersDao.deleteUser(input);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(whereMock).toHaveBeenCalledWith("id", input.id);
      expect(returningMock).toHaveBeenCalledWith(["id", "email"]);
      expect(delMock).toHaveBeenCalled();
      expect(delUser).toEqual(output);
    });
  });

  describe("findFullUserByEmail", () => {
    it("finds a user by email input and returns full table info", async () => {
      const input = "test@test.com";
      const output = {
        id: 1,
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
        role: "poster",
      };

      const whereMock = jest.fn().mockResolvedValue(output);
      const firstMock = jest.fn(() => ({
        where: whereMock,
      }));
      dbMock.mockImplementation(() => ({
        first: firstMock,
      }));

      const user = await UsersDao.findFullUserByEmail(input);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(firstMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalledWith("email", input);
      expect(user).toEqual(output);
    });
  });

  describe("findFullUserById", () => {
    it("finds a user by id input and returns full table info", async () => {
      const input = 1;
      const output = {
        id: 1,
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
        role: "poster",
      };

      const whereMock = jest.fn().mockResolvedValue(output);
      const firstMock = jest.fn(() => ({
        where: whereMock,
      }));
      dbMock.mockImplementation(() => ({
        first: firstMock,
      }));

      const user = await UsersDao.findFullUserById(input);

      expect(dbMock).toHaveBeenCalledWith("users");
      expect(firstMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalledWith("id", input);
      expect(user).toEqual(output);
    });
  });
});

describe("UsersDao errors", () => {
  //Test Error Throws
  describe("createUser -E", () => {
    it("throws an error if db insert fails", async () => {
      const error = new Error("DB Insert Failed");

      const input = {
        email: "test@test.com",
        firstName: "Fname",
        lastName: "Lname",
        password: "password",
      };
      const transformedData = {
        email: "test@test.com",
        first_name: "Fname",
        last_name: "Lname",
        password: "password",
      };

      transformUserData.mockReturnValue(transformedData);

      const returningMock = jest.fn().mockRejectedValue(error);
      const insertMock = jest.fn(() => ({
        returning: returningMock,
      }));
      dbMock.mockImplementation(() => ({
        insert: insertMock,
      }));

      await expect(UsersDao.createUser(input)).rejects.toThrow(error.message);
      expect(returningMock).toHaveBeenCalledWith("id");
      expect(insertMock).toHaveBeenCalledWith(transformedData);
      expect(dbMock).toHaveBeenCalledWith("users");
    });
  });
});
