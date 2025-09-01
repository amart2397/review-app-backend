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
  "r.id as id",
  "r.review_title",
  "r.review_text",
  "r.review_rating",
  "r.private",
  "u.id as userId",
  "u.display_name",
  "m.id as mediaId",
  "m.media_type",
  "m.media_key",
  "m.title as media_title",
  "m.description as media_description",
  "m.art_large",
  "m.art_small",
  "m.authors",
  "m.release_date",
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
  "cmd.id as id",
  "c.id as clubId",
  "c.name as clubName",
  "c.media_type as mediaType",
  "u.id as creatorId",
  "u.display_name as displayName",
  "m.id as mediaId",
  "m.title as mediaTitle",
  "m.description as mediaDescription",
  "m.art_large",
  "m.art_small",
  "m.authors",
  "m.release_date",
  "m.publisher",
  "m.runtime",
];

//Club Thread Columns
export const clubThreadColumnsToReturn = [
  "t.id as id",
  "t.club_media_id as clubMediaId",
  "t.created_by as creatorId",
  "u.display_name as creatorName",
  "t.title",
  "t.default",
  "t.created_at",
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
