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
    const invitesRaw = await db("club_invites as ci")
      .join("users as u", "ci.invitee_id", "u.id")
      .join("clubs as c", "ci.club_id", "c.id")
      .select(clubInvitesColumnsToReturn)
      .where("ci.club_id", clubId)
      .andWhere("ci.expires_at", ">", new Date())
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("ci.id", "<", cursor);
        }
      })
      .orderBy("ci.id", "desc")
      .limit(limit);
    const invites = transformReturnClubInvitesData(invitesRaw);
    return invites;
  }

  async getUserInvites(userId) {
    const invitesRaw = await db("club_invites as ci")
      .join("users as inviter", "ci.inviter_id", "inviter.id")
      .join("users as invitee", "ci.invitee_id", "invitee.id")
      .join("clubs as c", "ci.club_id", "c.id")
      .join("club_members as cm", function () {
        this.on("cm.user_id", "ci.inviter_id").andOn(
          "cm.club_id",
          "ci.club_id"
        );
      })
      .select(meClubInvitesColumnsToReturn)
      .where("ci.invitee_id", userId)
      .where("ci.expires_at", ">", new Date());
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
    const invite = await db("club_invites as ci")
      .join("users as inviter", "ci.inviter_id", "inviter.id")
      .join("users as invitee", "ci.invitee_id", "invitee.id")
      .join("clubs as c", "ci.club_id", "c.id")
      .join("club_members as cm", function () {
        this.on("cm.user_id", "ci.inviter_id").andOn(
          "cm.club_id",
          "ci.club_id"
        );
      })
      .select(meClubInvitesColumnsToReturn)
      .where("ci.id", inviteId)
      .first();
    return invite;
  }

  async getInviteByUserAndClub(userId, clubId) {
    const inviteRaw = await db("club_invites as ci")
      .join("users as inviter", "ci.inviter_id", "inviter.id")
      .join("users as invitee", "ci.invitee_id", "invitee.id")
      .join("clubs as c", "ci.club_id", "c.id")
      .join("club_members as cm", function () {
        this.on("cm.user_id", "ci.inviter_id").andOn(
          "cm.club_id",
          "ci.club_id"
        );
      })
      .select(meClubInvitesColumnsToReturn)
      .where("ci.invitee_id", userId)
      .where("ci.club_id", clubId);
    const invite = transformReturnUserInvitesData(inviteRaw)?.invites?.[0];
    return invite;
  }
}

export default new ClubInvitesDao();
