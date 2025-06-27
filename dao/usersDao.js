import db from "../db/db.js";
import { transformUserData } from "./transformData.js";

/*I don't want to return the password field,
so I am dynamically exluding it with the lines below*/
const userTblColumns = await db("users").columnInfo();
const columnsToReturn = Object.keys(userTblColumns).filter(
  (col) => col !== "password"
);

class UsersDao {
  async createUser(inputUserData) {
    const transformedData = transformUserData(inputUserData);
    const id = await db("users").insert(transformedData).returning("id");
    return id;
  }

  async getAllUsers() {
    const users = await db("users").select(columnsToReturn);
    return users;
  }

  async updateUser(inputUserData) {
    const transformedData = transformUserData(inputUserData);
    await db("users").where("id", transformedData.id).update(transformedData);
  }

  async deleteUser(id) {
    const delUser = await db("users")
      .where("id", id)
      .returning("id", "email")
      .del();
    return delUser;
  }

  async findUserByEmail(email) {
    const user = db("users").first(columnsToReturn).where("email", email);
    return user;
  }

  async findUserById(id) {
    const user = db("users").first(columnsToReturn).where("id", id);
    return user;
  }
}

export default new UsersDao();
