import db from "../db/db.js";
import { transformUserData } from "../transformers/transformData.js";
import { usersColumnsToReturn } from "../config/returnColumnsConfig.js";

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

  async getUserById(id) {
    const user = await db("users").first(usersColumnsToReturn).where("id", id);
    return user;
  }

  async getUserByEmail(email) {
    const user = await db("users")
      .first(usersColumnsToReturn)
      .where("email", email);
    return user;
  }

  //IMPORTANT: This method returns the user password
  //should NOT be used when sending data back to client!
  async getUserPassword({ id, email }) {
    if (id) {
      const { password } = await db("users").first().where("id", id);
      return password;
    }
    if (email) {
      const { password } = await db("users").first().where("email", email);
      return password;
    }
    throw new Error("Must provide either id or email to getUserPassword");
  }
}

export default new UsersDao();
