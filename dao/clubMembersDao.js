import db from "../db/db.js";
import {
  transformClubMemberData,
  transformReturnClubMemberData,
  transformReturnUserClubsData,
} from "../transformers/transformData.js";
import { clubMembersColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubMembersDao {
  async getClubMembers(clubId) {
    const membersRaw = await db("club_members")
      .join("users", "club_members.user_id", "users.id")
      .join("clubs", "club_members.club_id", "clubs.id")
      .where("club_members.club_id", clubId)
      .select(clubMembersColumnsToReturn);
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
      .where("id", memberId)
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

  async getClubsForUser(userId) {
    const userClubsRaw = await db("club_members")
      .join("users", "club_members.user_id", "users.id")
      .join("clubs", "club_members.club_id", "clubs.id")
      .where("club_members.user_id", userId)
      .select(clubMembersColumnsToReturn);
    const userClubs = transformReturnUserClubsData(userClubsRaw);
    return userClubs;
  }
}

export default new ClubMembersDao();
