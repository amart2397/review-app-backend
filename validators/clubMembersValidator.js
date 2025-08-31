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
    const memberData = await ClubMembersDao.getClubMembers(clubId);

    if (!club) {
      throw AppError.badRequest("Club id does not exist");
    }
    if (club.isPrivate && !invite) {
      throw AppError.forbidden(
        "You do not have an active invitation to this club"
      );
    }
    if (
      memberData.members &&
      memberData.members.length > 0 &&
      role === "creator"
    ) {
      throw AppError.conflict("Clubs can only have one creator");
    }
    return inputClubMemberData;
  }

  async validateUpdateClubMember(inputClubMemberData) {
    const { id, role, userId, clubId } = inputClubMemberData;
    const member = await ClubMembersDao.getMemberById(id);
    const requestMember = await ClubMembersDao.getMemberByUserAndClub(
      userId,
      clubId
    );
    if (!member) {
      throw AppError.badRequest("Club member does not exist");
    }
    if (member.clubId !== clubId) {
      throw AppError.badRequest("invalid member id and club id pair");
    }
    if (!requestMember || requestMember?.memberRole === "member") {
      throw AppError.forbidden(
        "You are not authorized to change member roles for this club"
      );
    }
    if (role === "member" && requestMember?.memberRole !== "creator") {
      throw AppError.forbidden("Only the club creator can revoke permissions");
    }
    return inputClubMemberData;
  }

  async validateDeleteClubMember(inputClubMemberData) {
    const { id, userId, clubId } = inputClubMemberData;
    const requestMember = await ClubMembersDao.getMemberByUserAndClub(
      userId,
      clubId
    );
    const delMember = await ClubMembersDao.getMemberById(id);
    if (!delMember) {
      throw AppError.badRequest("Member does not exist");
    }
    if (delMember.clubId !== clubId) {
      throw AppError.badRequest("invalid member id and club id pair");
    }
    if (
      (!requestMember || requestMember?.memberRole === "member") &&
      requestMember?.userId !== delMember?.userId
    ) {
      throw AppError.forbidden(
        "You are not authorized to remove members from this club"
      );
    }
    if (delMember?.memberRole === "creator") {
      throw AppError.badRequest("Cannot remove the creator");
    }
    if (
      delMember?.memberRole === "admin" &&
      requestMember?.memberRole !== "creator"
    ) {
      throw AppError.forbidden("Only the creator is allowed to remove admins");
    }
    return inputClubMemberData;
  }

  async validateUserIsClubMember(userId, clubId) {
    const member = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    if (!member) {
      throw AppError.forbidden("You are not a member of this club");
    }
    return;
  }
}

export default new ClubMembersValidator();
