import db from "../db/db.js";
import { transformUserData } from "./transformData.js";
import { usersColumnsToReturn } from "./returnColumnsConfig.js";

class UsersDao {
  //Safe methods for returning data to client
  async getAllUsers() {
    const users = await db("users").select(usersColumnsToReturn);
    return users;
  }

  async createUser(inputUserData) {
    const transformedData = transformUserData(inputUserData);
    const [{ id }] = await db("users").insert(transformedData).returning("id");
    return id;
  }

  async getUserByID(inputUserData) {
    const { id } = inputUserData;
    const user = db("users").first(usersColumnsToReturn).where("id", id);
    return user;
  }

  async updateUser(inputUserData) {
    const transformedData = transformUserData(inputUserData);
    await db("users").where("id", transformedData.id).update(transformedData);
  }

  async deleteUser(inputUserData) {
    const { id } = inputUserData;
    const [delUser] = await db("users")
      .where("id", id)
      .returning(["id", "email"])
      .del();
    return delUser;
  }

  //IMPORTANT: These methods return all columns including the user password.
  // They are intended only for internal server logic, not for returning data to client!
  // When returning data to the client, the getUserById method above should be used.
  async findFullUserByEmail(email) {
    const user = db("users").first().where("email", email);
    return user;
  }

  async findFullUserById(id) {
    const user = db("users").first().where("id", id);
    return user;
  }
}

export default new UsersDao();
