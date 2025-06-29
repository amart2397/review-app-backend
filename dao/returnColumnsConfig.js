//In most cases, I don't want to return the password field from the database,
//so I am dynamically exluding it with the lines below
export const usersColumnsToReturn = [
  "id",
  "email",
  "first_name",
  "last_name",
  "role",
];
