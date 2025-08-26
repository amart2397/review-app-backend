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
    clubMediaId: z.int(),
    userId: z.int(),
    clubId: z.int(),
    title: z.string(),
  })
  .strict();

const deleteClubThreadSchema = z.object({
  id: z.int(),
  clubMediaId: z.int(),
  userId: z.int(),
  clubId: z.int(),
  role: z.string(),
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
      throw AppError.badRequest("Invalid club media id and club id pair");
    }
    return inputThreadData;
  }

  async validateUpdateThread(inputThreadData) {
    const { id, userId, clubId, clubMediaId } = inputThreadData;
    const updater = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const thread = await ClubThreadsDao.getClubThreadById(id);
    const clubMedia = await ClubMediaDao.getClubMediaById(clubMediaId);
    //Thread must exist
    if (!thread) {
      throw AppError.badRequest("Thread id does not exist");
    }
    //Club media must match to thread
    if (clubMedia?.media[0]?.clubMediaId !== thread.clubMediaId) {
      throw AppError.badRequest(
        "Invalid club media id and club thread id pair"
      );
    }
    //Club media must be for selected club
    if (clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id and club id pair");
    }
    //Only the club admins/creator can edit threads
    if (!updater || updater.memberRole === "member") {
      throw AppError.forbidden("You are not authorized to update this thread");
    }
    return inputThreadData;
  }

  async validateDeleteThread(inputThreadData) {
    const { id, userId, clubId, clubMediaId, role } = inputThreadData;
    const deleter = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const thread = await ClubThreadsDao.getClubThreadById(id);
    const clubMedia = await ClubMediaDao.getClubMediaById(clubMediaId);
    //Thread must exist
    if (!thread) {
      throw AppError.badRequest("Thread id does not exist");
    }
    //Club media must match to thread
    if (clubMedia?.media[0]?.clubMediaId !== thread.clubMediaId) {
      throw AppError.badRequest(
        "Invalid club media id and club thread id pair"
      );
    }
    //Club media must be for selected club
    if (clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id and club id pair");
    }
    if (role !== "admin") {
      //Only the club admins/creator can edit threads
      if (!deleter || deleter.memberRole === "member") {
        throw AppError.forbidden(
          "You are not authorized to update this thread"
        );
      }
    }
    return inputThreadData;
  }

  async validateThreadAndClub(threadId, clubId) {
    const thread = await ClubThreadsDao.getClubThreadById(threadId);
    const clubMedia = await ClubMediaDao.getClubMediaById(thread.clubMediaId);
    if (clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invlaid thread id and club id pair");
    }
  }
}

export default new ClubThreadsValidator();
