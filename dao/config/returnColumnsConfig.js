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

//Reviews Columns
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
  "media.media_key",
  "media.title as media_title",
  "media.description as media_description",
  "media.art_large",
  "media.art_small",
  "media.authors",
  "media.release_date",
];

//Clubs Columns
export const clubsColumnsToReturn = [
  "clubs.id as clubId",
  "clubs.name as clubName",
  "clubs.description as clubDescription",
  "clubs.media_type",
  "clubs.is_private",
  "clubs.creator_id",
  "users.first_name",
  "users.last_name",
];
