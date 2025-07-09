/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("media").del();
  await knex("media").insert([
    {
      media_type: "book",
      media_key: "book_key",
      media_title: "Book Title",
      media_description: "Book Description",
      media_art: "https://picsum.photos/200/300",
    },
    {
      media_type: "movie",
      media_key: "movie_key",
      media_title: "Movie Title",
      media_description: "Movie Description",
      media_art: "https://picsum.photos/200/300",
    },
  ]);
  await knex("reviews").del();
  await knex("reviews").insert([
    {
      user_id: 1,
      media_id: 1,
      review_title: "Admin Review Title One",
      review_text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      review_rating: 2.5,
    },
    {
      user_id: 1,
      media_id: 2,
      review_title: "Admin Review Title Two",
      review_text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      review_rating: 5.5,
    },
    {
      user_id: 2,
      media_id: 1,
      review_title: "Poster Review Title One",
      review_text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      review_rating: 6.5,
    },
    {
      user_id: 2,
      media_id: 2,
      review_title: "Poster Review Title Two",
      review_text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      review_rating: 9.4,
    },
  ]);
};
