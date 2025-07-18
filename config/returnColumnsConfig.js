//Users Columns - I don't want to send the password to the frontend!
export const usersColumnsToReturn = ["id", "first_name", "last_name", "role"];

//Media Columns
export const mediaColumnsToReturn = [
  "id",
  "media_type",
  "media_key",
  "title",
  "description",
  "art_large",
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
  "media.title as media_title",
  "media.description as media_description",
  "media.art_large",
];
