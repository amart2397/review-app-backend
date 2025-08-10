import * as z from "zod/v4";
import ClubsDao from "../dao/clubsDao.js";
import compareSchema from "./helpers/compareSchema.js";
import env from "dotenv";
import AppError from "../utils/AppError.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ClubInvitesDao from "../dao/clubInvitesDao.js";
import UsersDao from "../dao/usersDao.js";
env.config();

const newInviteSchema = z.object({
  clubId: z.int(),
  inviterId: z.int(),
  inviteeId: z.int(),
  expiration: z.date(),
});

const deleteInviteSchema = z.object({
  id: z.int(),
  userId: z.int(),
});

class ClubInviteValidator {
  //schema validation (using zod)
  validateNewInviteSchema(inputInviteData) {
    return compareSchema(newInviteSchema, inputInviteData);
  }
  validateDeleteInviteSchema(inputInviteData) {
    return compareSchema(deleteInviteSchema, inputInviteData);
  }

  //app logic validation
  async validateNewClubInvite(inputInviteData) {
    const { clubId, inviterId, inviteeId } = inputInviteData;
    const club = await ClubsDao.getClubById(clubId);
    //Can't invite yourself
    if (inviterId === inviteeId) {
      throw AppError.badRequest("Cannot send invite to self");
    }
    //club must exits
    if (!club) {
      throw AppError.badRequest("Club id not found");
    }
    //Inviter must be in club and have higher permissions
    const inviter = await ClubMembersDao.getMemberByUserAndClub(
      inviterId,
      clubId
    );
    if (inviter?.memberRole === "member") {
      throw AppError.forbidden(
        "You are not authorized to add members to this club"
      );
    }
    //Invitee must exist
    const invitee = await UsersDao.getUserById(inviteeId);
    if (!invitee) {
      throw AppError.badRequest("Invitee doesn't exist");
    }
    //Check if invitee has already been invited
    const existingInvite = await ClubInvitesDao.getInviteByUserAndClub(
      inviteeId,
      clubId
    );
    if (existingInvite?.invites?.length > 0) {
      const invite = existingInvite.invites[0];
      if (new Date(invite.expiration) < new Date()) {
        await ClubInvitesDao.deleteInvite(invite.id); //if existing invite is expired, delete it
      } else {
        throw AppError.conflict("Invitee already has a pending invite");
      }
    }
    const inviteeCurrentMember = await ClubMembersDao.getMemberByUserAndClub(
      inviteeId,
      clubId
    );
    if (inviteeCurrentMember) {
      throw AppError.conflict("User already a member");
    }
    return inputInviteData;
  }

  async validateDeleteClubInvite(inputInviteData) {
    const { id, userId } = inputInviteData;
    const invite = await ClubInvitesDao.getInviteById(id);
    if (!invite) {
      throw AppError.badRequest("Invite not found");
    }
    if (invite.inviterId !== userId && invite.inviterMemberRole === "member") {
      throw AppError.forbidden("You are not authorized to delete this invite");
    }
    return inputInviteData;
  }
}

export default new ClubInviteValidator();
