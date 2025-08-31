import db from "../db/db.js";
import {
  clubInvitesColumnsToReturn,
  meClubInvitesColumnsToReturn,
} from "./config/returnColumnsConfig.js";
import {
  transformClubInviteData,
  transformReturnClubInvitesData,
  transformReturnUserInvitesData,
} from "../transformers/transformData.js";

class ClubInvitesDao {
  async getClubInvites(clubId, cursor = null, limit = 20) {
    const invitesRaw = await db("club_invites")
      .join("users", "club_invites.invitee_id", "users.id")
      .join("clubs", "club_invites.club_id", "clubs.id")
      .select(clubInvitesColumnsToReturn)
      .where("club_invites.club_id", clubId)
      .andWhere("club_invites.expires_at", ">", new Date())
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("club_invites.id", "<", cursor);
        }
      })
      .orderBy("club_invites.id", "desc")
      .limit(limit);
    const invites = transformReturnClubInvitesData(invitesRaw);
    return invites;
  }

  async getUserInvites(userId) {
    const invitesRaw = await db("club_invites")
      .join("users as inviter", "club_invites.inviter_id", "inviter.id")
      .join("users as invitee", "club_invites.invitee_id", "invitee.id")
      .join("clubs", "club_invites.club_id", "clubs.id")
      .join("club_members", function () {
        this.on("club_members.user_id", "club_invites.inviter_id").andOn(
          "club_members.club_id",
          "club_invites.club_id"
        );
      })
      .select(meClubInvitesColumnsToReturn)
      .where("club_invites.invitee_id", userId)
      .where("club_invites.expires_at", ">", new Date());
    const invites = transformReturnUserInvitesData(invitesRaw);
    return invites;
  }

  async createInvite(inviteData) {
    const transformedData = transformClubInviteData(inviteData);
    const [{ id }] = await db("club_invites")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async deleteInvite(inviteId) {
    const [{ id }] = await db("club_invites")
      .where("id", inviteId)
      .returning("id")
      .del();
    return id;
  }

  async getInviteById(inviteId) {
    const invite = await db("club_invites")
      .join("users as inviter", "club_invites.inviter_id", "inviter.id")
      .join("users as invitee", "club_invites.invitee_id", "invitee.id")
      .join("clubs", "club_invites.club_id", "clubs.id")
      .join("club_members", function () {
        this.on("club_members.user_id", "club_invites.inviter_id").andOn(
          "club_members.club_id",
          "club_invites.club_id"
        );
      })
      .select(meClubInvitesColumnsToReturn)
      .where("club_invites.id", inviteId)
      .first();
    return invite;
  }

  async getInviteByUserAndClub(userId, clubId) {
    const inviteRaw = await db("club_invites")
      .join("users as inviter", "club_invites.inviter_id", "inviter.id")
      .join("users as invitee", "club_invites.invitee_id", "invitee.id")
      .join("clubs", "club_invites.club_id", "clubs.id")
      .join("club_members", function () {
        this.on("club_members.user_id", "club_invites.inviter_id").andOn(
          "club_members.club_id",
          "club_invites.club_id"
        );
      })
      .select(meClubInvitesColumnsToReturn)
      .where("club_invites.invitee_id", userId)
      .where("club_invites.club_id", clubId);
    const invite = transformReturnUserInvitesData(inviteRaw).invites?.[0];
    return invite;
  }
}

export default new ClubInvitesDao();
