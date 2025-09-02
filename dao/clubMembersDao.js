import db from "../db/db.js";
import {
  transformClubMemberData,
  transformReturnClubMemberData,
} from "../transformers/transformData.js";
import { clubMembersColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubMembersDao {
  async getClubMembers(clubId, cursor = null, limit = 50) {
    const membersRaw = await db("club_members as cm")
      .join("users as u", "cm.user_id", "u.id")
      .join("clubs as c", "cm.club_id", "c.id")
      .where("cm.club_id", clubId)
      .select(clubMembersColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("cm.id", "<", cursor);
        }
      })
      .orderBy("cm.id", "desc")
      .limit(limit);
    const members = transformReturnClubMemberData(membersRaw);
    return members;
  }

  async createMember(inputMemberData) {
    const transformedData = transformClubMemberData(inputMemberData);
    const [{ id }] = await db("club_members")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async updateMemberRole(memberId, newRole) {
    await db("club_members").where("id", memberId).update({ role: newRole });
  }

  async deleteMember(memberId) {
    const [{ id }] = await db("club_members")
      .where("id", memberId)
      .returning("id")
      .del();
    return id;
  }

  async getMemberById(memberId) {
    const member = await db("club_members as cm")
      .join("users as u", "cm.user_id", "u.id")
      .join("clubs as c", "cm.club_id", "c.id")
      .where("cm.id", memberId)
      .first(clubMembersColumnsToReturn);
    return member;
  }

  async getMemberByUserAndClub(userId, clubId) {
    const member = await db("club_members as cm")
      .join("users as u", "cm.user_id", "u.id")
      .join("clubs as c", "cm.club_id", "c.id")
      .where("cm.user_id", userId)
      .where("cm.club_id", clubId)
      .first(clubMembersColumnsToReturn);
    return member;
  }
}

export default new ClubMembersDao();
