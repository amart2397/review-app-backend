//Users Columns - I don't want to send the password to the frontend!
export const usersColumnsToReturn = ["id", "display_name", "role"];

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
  "users.display_name",
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
  "clubs.media_type",
  "clubs.is_private",
  "clubs.creator_id",
  "users.display_name",
];

//Club Invites Columns
export const clubInvitesColumnsToReturn = [
  "club_invites.id as id",
  "club_invites.club_id as clubId",
  "clubs.name as clubName",
  "users.id as userId",
  "users.display_name",
];

//Club Invites for Me Columns
export const meClubInvitesColumnsToReturn = [
  "club_invites.id as id",
  "club_invites.club_id as clubId",
  "clubs.name as clubName",
  "inviter.id as inviterId",
  "inviter.display_name as inviterDisplayName",
  "invitee.id as inviteeId",
  "invitee.display_name as inviteeDisplayName",
  "club_invites.expires_at",
  "club_members.role as inviterMemberRole",
];

//Club Members Columns
export const clubMembersColumnsToReturn = [
  "club_members.id as memberId",
  "club_members.club_id as clubId",
  "club_members.user_id as userId",
  "club_members.role as memberRole",
  "users.display_name as displayName",
  "clubs.name as clubName",
];
