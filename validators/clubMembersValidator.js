import * as z from "zod/v4";
import ClubsDao from "../dao/clubsDao.js";
import compareSchema from "./helpers/compareSchema.js";
import env from "dotenv";
import AppError from "../utils/AppError.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ClubInvitesDao from "../dao/clubInvitesDao.js";
env.config();

const newClubMemberSchema = z.object({
  clubId: z.int(),
  userId: z.int(),
  role: z.enum(["member", "admin", "creator"]).optional(),
});

const updateClubMemberSchema = z
  .object({
    id: z.int(),
    role: z.enum(["member", "admin"]),
    userId: z.int(),
    clubId: z.int(),
  })
  .strict();

const deleteClubMemberSchema = z.object({
  id: z.int(),
  userId: z.int(),
  clubId: z.int(),
});

class ClubMembersValidator {
  //schema validation (using zod)
  validateNewClubMemberSchema(inputClubMemberData) {
    return compareSchema(newClubMemberSchema, inputClubMemberData);
  }
  validateUpdateClubMemberSchema(inputClubMemberData) {
    return compareSchema(updateClubMemberSchema, inputClubMemberData);
  }
  validateDeleteClubMemberSchema(inputClubMemberData) {
    return compareSchema(deleteClubMemberSchema, inputClubMemberData);
  }

  //app logic validation
  async validateNewClubMember(inputClubMemberData) {
    const { clubId, userId, role } = inputClubMemberData;
    const club = await ClubsDao.getClubById(clubId);
    const invite = await ClubInvitesDao.getInviteByUserAndClub(userId, clubId);
    const members = await ClubMembersDao.getClubMembers(clubId);

    if (!club) {
      throw AppError.badRequest("Club id does not exist");
    }
    if (club.isPrivate && !invite) {
      throw AppError.forbidden(
        "You do not have an active invitation to this club"
      );
    }
    if (members && members.length > 0 && role === "creator") {
      throw AppError.conflict("Clubs can only have one creator");
    }
    return inputClubMemberData;
  }

  async validateUpdateClubMember(inputClubMemberData) {
    const { id, role, userId, clubId } = inputClubMemberData;
    const member = await ClubMembersDao.getMemberById(id);
    const requestMember = ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    if (!member) {
      throw AppError.badRequest("Club member does not exist");
    }
    if (!requestMember || requestMember?.role === "member") {
      throw AppError.forbidden(
        "You are not authorized to change member roles foir this club"
      );
    }
    if (role === "member" && requestMember?.role !== "creator") {
      throw AppError.forbidden("Only the club creator can revoke permissions");
    }
    return inputClubMemberData;
  }

  async validateDeleteClubMember(inputClubMemberData) {
    const { id, userId, clubId } = inputClubMemberData;
    const requestMember = ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const delMember = ClubMembersDao.getMemberById(id);
    if (!delMember) {
      throw AppError.badRequest("Member does not exist");
    }
    if (requestMember?.role === "member") {
      throw AppError.forbidden(
        "You are not authroized to remove members from this club"
      );
    }
    return inputClubMemberData;
  }
}

export default new ClubMembersValidator();
