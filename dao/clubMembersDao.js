import db from "../db/db.js";
import {
  transformClubMemberData,
  transformReturnClubMemberData,
  transformReturnUserClubsData,
} from "../transformers/transformData.js";
import { clubMembersColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubMembersDao {
  async getClubMembers(clubId, cursor = null, limit = 50) {
    const membersRaw = await db("club_members")
      .join("users", "club_members.user_id", "users.id")
      .join("clubs", "club_members.club_id", "clubs.id")
      .where("club_members.club_id", clubId)
      .select(clubMembersColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("club_members.id", "<", cursor);
        }
      })
      .orderBy("club_members.id", "desc")
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
    const member = await db("club_members")
      .join("users", "club_members.user_id", "users.id")
      .join("clubs", "club_members.club_id", "clubs.id")
      .where("club_members.id", memberId)
      .first(clubMembersColumnsToReturn);
    return member;
  }

  async getMemberByUserAndClub(userId, clubId) {
    const member = await db("club_members")
      .join("users", "club_members.user_id", "users.id")
      .join("clubs", "club_members.club_id", "clubs.id")
      .where("user_id", userId)
      .where("club_id", clubId)
      .first(clubMembersColumnsToReturn);
    return member;
  }
}

export default new ClubMembersDao();
