/**
 * These functions transform input data to match database table schema
 * @param {Object} data input data object
 * @returns {Object} renamed data object
 */
export const transformUserData = (data) => {
  const newKeys = {
    id: "id",
    email: "email",
    firstName: "first_name",
    lastName: "last_name",
    password: "password",
    role: "role",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};
