import db from "../db/db.js";

/*I don't want to return the password field,
so I am dynamically exluding it with the lines below*/
const userTblColumns = await db("users").columnInfo();
const columnsToReturn = Object.keys(userTblColumns).filter(
  (col) => col !== "password"
);

class UsersDao {
  async createUser(userData) {
    const id = await db("users")
      .insert({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
      })
      .returning("id");

    return id;
  }

  async getAllUsers() {
    const users = await db("users").select(columnsToReturn);

    return users;
  }

  async deleteUser(userData) {
    const { id } = userData;
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

export default UsersDao();
