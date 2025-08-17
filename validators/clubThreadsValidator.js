import * as z from "zod/v4";
import compareSchema from "./helpers/compareSchema.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ClubsDao from "../dao/clubsDao.js";
import ClubMediaDao from "../dao/clubMediaDao.js";
import AppError from "../utils/AppError.js";
import ClubThreadsDao from "../dao/clubThreadsDao.js";

const newClubThreadSchema = z.object({
  clubMediaId: z.int(),
  userId: z.int(),
  clubId: z.int(),
  title: z.string(),
  default: z.boolean().optional(),
});

const updateClubThreadSchema = z
  .object({
    id: z.int(),
    userId: z.int(),
    clubId: z.int(),
    title: z.string(),
  })
  .strict();

const deleteClubThreadSchema = z.object({
  id: z.int(),
  userId: z.int(),
  clubId: z.int(),
});

class ClubThreadsValidator {
  //schema validation (using zod)
  validateNewThreadSchema(inputThreadData) {
    return compareSchema(newClubThreadSchema, inputThreadData);
  }

  validateUpdateThreadSchema(inputThreadData) {
    return compareSchema(updateClubThreadSchema, inputThreadData);
  }

  validateDeleteThreadSchema(inputThreadData) {
    return compareSchema(deleteClubThreadSchema, inputThreadData);
  }

  //app logic validation
  async validateNewThread(inputThreadData) {
    const { clubMediaId, userId, clubId } = inputThreadData;
    const club = await ClubsDao.getClubById(clubId);
    const creator = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const media = await ClubMediaDao.getClubMediaById(clubMediaId);
    //Club must exist
    if (!club) {
      throw AppError.badRequest("Club id does not exist");
    }
    //Creator must be a member and have admin or higher role
    if (!creator || creator.memberRole === "member") {
      throw AppError.forbidden(
        "You are not authorized to add new threads to this club"
      );
    }
    //Media must exist
    if (!media) {
      throw AppError.badRequest("Club media id does not exist");
    }
    //Media must be associated with current club
    if (media.clubId !== clubId) {
      throw AppError.badRequest("Media id not associated with club");
    }
    return inputThreadData;
  }

  async validateUpdateThread(inputThreadData) {
    const { id, userId, clubId } = inputThreadData;
    const updater = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const thread = await ClubThreadsDao.getClubThreadById(id);
    //Thread must exist
    if (!thread) {
      throw AppError.badRequest("Thread id does not exist");
    }
    //Only the creator can edit threads
    if (!updater || thread?.created_by !== userId) {
      throw AppError.forbidden("You are not authorized to update this thread");
    }
    return inputThreadData;
  }

  async validateDeleteThread(inputThreadData) {
    const { id, userId, clubId } = inputThreadData;
    const deleter = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const thread = await ClubThreadsDao.getClubThreadById(id);
    //Thread must exist
    if (!thread) {
      throw AppError.badRequest("Thread id does not exist");
    }
    //Only the creator can edit threads
    if (!deleter || thread?.created_by !== userId) {
      throw AppError.forbidden("You are not authorized to delete this thread");
    }
    return inputThreadData;
  }
}

export default new ClubThreadsValidator();
