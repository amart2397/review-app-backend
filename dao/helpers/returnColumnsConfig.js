//Users Columns - I don't want to send the password to the frontend!
export const usersColumnsToReturn = [
  "id",
  "email",
  "first_name",
  "last_name",
  "role",
];

//Post Columns
export const postsColumnsToReturn = [
  "posts.id as postId",
  "posts.post_title",
  "posts.post_text",
  "posts.post_rating",
  "users.id as userId",
  "users.first_name",
  "users.last_name",
  "media.id as mediaId",
  "media.media_type",
  "media.media_title",
  "media.media_description",
  "media.media_art",
];
