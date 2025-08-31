//Users Columns - I don't want to send the password to the frontend!
export const usersColumnsToReturn = ["id", "display_name", "role"];

//Media Columns
export const mediaColumnsToReturn = [
  "id",
  "media_type",
  "media_key",
  "title",
  "description",
  "art_small",
  "art_large",
  "authors",
  "release_date",
];

//Reviews Columns
export const reviewsColumnsToReturn = [
  "reviews.id as id",
  "reviews.review_title",
  "reviews.review_text",
  "reviews.review_rating",
  "reviews.private",
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
  "clubs.id as id",
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
  "club_members.id as id",
  "club_members.club_id as clubId",
  "club_members.user_id as userId",
  "club_members.role as memberRole",
  "users.display_name as displayName",
  "clubs.name as clubName",
];

//Club Media Columns
export const clubMediaColumnsToReturn = [
  "club_media.id as id",
  "clubs.id as clubId",
  "clubs.name as clubName",
  "clubs.media_type as mediaType",
  "users.id as creatorId",
  "users.display_name as displayName",
  "media.id as mediaId",
  "media.title as mediaTitle",
  "media.description as mediaDescription",
  "media.art_large",
  "media.art_small",
  "media.authors",
  "media.release_date",
  "media.publisher",
  "media.runtime",
];

//Club Thread Columns
export const clubThreadColumnsToReturn = [
  "threads.id as id",
  "threads.club_media_id as clubMediaId",
  "threads.created_by as creatorId",
  "users.display_name as creatorName",
  "threads.title",
  "threads.default",
  "threads.created_at",
];

//Club Thread Commments Columns
export const clubThreadCommentsColumnsToReturn = [
  "c.id as id",
  "c.content",
  "c.created_at",
  "c.parent_comment_id",
  "c.author_id",
  "c.deleted_at",
  "c.thread_id",
  "u.display_name as displayName",
];
