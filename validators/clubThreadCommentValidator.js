import * as z from "zod/v4";
import compareSchema from "./helpers/compareSchema.js";
import ClubMediaDao from "../dao/clubMediaDao.js";
import ClubThreadsDao from "../dao/clubThreadsDao.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import AppError from "../utils/AppError.js";
import ClubThreadCommentsDao from "../dao/clubThreadCommentsDao.js";
import ClubsDao from "../dao/clubsDao.js";

const newClubThreadCommentSchema = z.object({
  threadId: z.int(),
  userId: z.int(),
  content: z.string(),
  parentId: z.int().optional(),
  clubId: z.int(),
  clubMediaId: z.int(),
});

const updateClubThreadCommentSchema = z
  .object({
    id: z.int(),
    threadId: z.int(),
    userId: z.int(),
    content: z.string(),
    clubId: z.int(),
    clubMediaId: z.int(),
  })
  .strict();

const deleteClubThreadCommentSchema = z.object({
  id: z.int(),
  threadId: z.int(),
  userId: z.int(),
  clubId: z.int(),
  clubMediaId: z.int(),
  role: z.string(),
});

class ClubThreadCommentValidator {
  //schema validation (using zod)
  validateNewThreadCommentSchema(inputCommentData) {
    return compareSchema(newClubThreadCommentSchema, inputCommentData);
  }

  validateUpdateThreadCommentSchema(inputCommentData) {
    return compareSchema(updateClubThreadCommentSchema, inputCommentData);
  }

  validateDeleteThreadCommentSchema(inputCommentData) {
    return compareSchema(deleteClubThreadCommentSchema, inputCommentData);
  }

  //app logic validation
  async validateNewThreadCommment(inputCommentData) {
    const { threadId, userId, parentId, clubId, clubMediaId } =
      inputCommentData;
    const club = await ClubsDao.getClubById(clubId);
    const clubMedia = await ClubMediaDao.getClubMediaById(clubMediaId);
    const thread = await ClubThreadsDao.getClubThreadById(threadId);
    const commenter = await ClubMembersDao.getMemberByUserAndClub(
      userId,
      clubId
    );
    if (!club) {
      throw AppError.badRequest("Invalid club id");
    }
    if (!clubMedia || clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id");
    }
    if (!thread || thread.clubMediaId !== clubMediaId) {
      throw AppError.badRequest("Invalid club thread id");
    }
    if (parentId) {
      const parentComment =
        await ClubThreadCommentsDao.getClubThreadCommentById(parentId);
      if (!parentComment || parentComment.threadId !== threadId) {
        throw AppError.badRequest("Invalid parent comment id");
      }
    }
    if (!commenter) {
      throw AppError.forbidden("You are not a member of the associated club");
    }
    return inputCommentData;
  }

  async validateUpdatedThreadComment(inputCommentData) {
    const { id, threadId, userId, clubId, clubMediaId } = inputCommentData;
    const club = await ClubsDao.getClubById(clubId);
    const clubMedia = await ClubMediaDao.getClubMediaById(clubMediaId);
    const thread = await ClubThreadsDao.getClubThreadById(threadId);
    const comment = await ClubThreadCommentsDao.getClubThreadCommentById(id);
    const commenter = await ClubMembersDao.getMemberByUserAndClub(
      userId,
      clubId
    );
    if (!club) {
      throw AppError.badRequest("Invalid club id");
    }
    if (!clubMedia || clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id");
    }
    if (!thread || thread.clubMediaId !== clubMediaId) {
      throw AppError.badRequest("Invalid club thread id");
    }
    if (!comment || comment.threadId !== threadId) {
      throw AppError.badRequest("Invalid comment id");
    }
    if (!commenter || comment.author.id !== userId) {
      throw AppError.forbidden("You are not authorized to update this comment");
    }
    return inputCommentData;
  }

  async validateDeleteThreadComment(inputCommentData) {
    const { id, threadId, userId, clubId, clubMediaId, role } =
      inputCommentData;
    const club = await ClubsDao.getClubById(clubId);
    const clubMedia = await ClubMediaDao.getClubMediaById(clubMediaId);
    const thread = await ClubThreadsDao.getClubThreadById(threadId);
    const comment = await ClubThreadCommentsDao.getClubThreadCommentById(id);
    const commenter = await ClubMembersDao.getMemberByUserAndClub(
      userId,
      clubId
    );
    if (!club) {
      throw AppError.badRequest("Invalid club id");
    }
    if (!clubMedia || clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id");
    }
    if (!thread || thread.clubMediaId !== clubMediaId) {
      throw AppError.badRequest("Invalid club thread id");
    }
    if (!comment || comment.threadId !== threadId) {
      throw AppError.badRequest("Invalid comment id");
    }
    if (comment.deleted) {
      throw AppError.badRequest("Comment already deleted");
    }
    if (role !== "admin") {
      //App admins can delete comments for moderation
      if (
        !commenter ||
        (comment.author.id !== userId && commenter.memberRole === "member")
      ) {
        throw AppError.forbidden(
          "You are not authorized to delete this comment"
        );
      }
    }
    return inputCommentData;
  }

  async validateCommentAndClub(commentId, clubId) {
    const comment = await ClubThreadCommentsDao.getClubThreadCommentById(
      commentId
    );
    const thread = await ClubThreadsDao.getClubThreadById(comment.threadId);
    const clubMedia = await ClubMediaDao.getClubMediaById(thread.clubMediaId);
    const compareClubId = clubMedia.clubId;
    if (compareClubId !== clubId) {
      throw AppError.badRequest("Invalid club id and comment id pair");
    }
  }
}

export default new ClubThreadCommentValidator();
