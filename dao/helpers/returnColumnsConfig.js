//Users Columns - I don't want to send the password to the frontend!
export const usersColumnsToReturn = ["id", "first_name", "last_name"];

//Media Columns
export const mediaColumnsToReturn = [
  "id",
  "media_type",
  "media_key",
  "media_title",
  "media_description",
  "media_art",
];

//Post Columns
export const reviewsColumnsToReturn = [
  "reviews.id as reviewId",
  "reviews.review_title",
  "reviews.review_text",
  "reviews.review_rating",
  "users.id as userId",
  "users.first_name",
  "users.last_name",
  "media.id as mediaId",
  "media.media_type",
  "media.media_title",
  "media.media_description",
  "media.media_art",
];
