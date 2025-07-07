/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      email: "admin@test.com",
      first_name: "Alex",
      last_name: "Admin",
      password: "test1234",
      role: "admin",
    },
    {
      email: "poster@test.com",
      first_name: "Alex",
      last_name: "Poster",
      password: "test1234",
      role: "poster",
    },
    {
      email: "user@test.com",
      first_name: "Alex",
      last_name: "User",
      password: "test1234",
    },
  ]);
  await knex("media").del();
  await knex("media").insert([
    {
      media_type: "book",
      media_key: "book_key",
      media_title: "Book Title",
      media_description: "Book Description",
      media_art: "Book Art",
    },
    {
      media_type: "movie",
      media_key: "movie_key",
      media_title: "Movie Title",
      media_description: "Movie Description",
      media_art: "Movie Art",
    },
  ]);
};
