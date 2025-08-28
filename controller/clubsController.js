import expressAsyncHandler from "express-async-handler";
import ClubsService from "../service/clubsService.js";
import ClubsValidator from "../validators/clubsValidator.js";
import AppError from "../utils/AppError.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";
import ClubInviteValidator from "../validators/clubInviteValidator.js";
import ClubMediaValidator from "../validators/clubMediaValidator.js";
import ClubThreadsValidator from "../validators/clubThreadsValidator.js";
import ClubThreadCommentValidator from "../validators/clubThreadCommentValidator.js";
import ReviewsService from "../service/reviewsService.js";

class ClubsController {
  //CLUBS

  // @desc Get all public clubs
  // @route GET /clubs?cursor
  // @access Private
  getAllPublicClubs = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const clubs = await ClubsService.getPublicClubs(cursor);
    res.json(clubs);
  });

  // @desc post new club
  // @route POST /clubs
  // @access Private
  createClub = expressAsyncHandler(async (req, res) => {
    const { name, mediaType, isPrivate } = req.body;
    const creatorId = req.user.id;
    const inputClubData = {
      name,
      creatorId,
      mediaType,
      isPrivate,
    };
    const validatedData = ClubsValidator.validateNewClubSchema(inputClubData);
    const newClubId = await ClubsService.createClub(validatedData);
    res.status(201).json({
      message: `New club with id ${newClubId} created`,
    });
  });

  // @desc update existing club
  // @route PATCH /clubs/:id
  // @access Private
  updateClub = expressAsyncHandler(async (req, res) => {
    const { id: id_body, name, isPrivate } = req.body;
    const userId = req.user.id;
    const id = parseInt(req.params.clubId);
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputClubData = { id, userId, name, isPrivate };
    const validatedData =
      ClubsValidator.validateUpdateClubSchema(inputClubData);
    await ClubsService.updateClub(validatedData);
    res.json({
      message: `Club with id ${id} updated`,
    });
  });

  // @desc delete existing club
  // @route DELETE /clubs/:id
  // @access Private
  deleteClub = expressAsyncHandler(async (req, res) => {
    const { id: id_body } = req?.body;
    const userId = req.user.id;
    const role = req.user.role;
    const id = parseInt(req.params.clubId);
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputClubData = { id, userId, role };
    const validatedData =
      ClubsValidator.validateDeleteClubSchema(inputClubData);
    const { id: club_id, name } = await ClubsService.deleteClub(validatedData);
    res.json({
      message: `Club: ${name} with id ${club_id} was deleted`,
    });
  });

  //CLUB INVITES

  // @desc Get current invites for club
  // @route GET /clubs/:clubId/invites?cursor
  // @access Private
  getClubInvites = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const invites = await ClubsService.getClubInvites(userId, clubId, cursor);
    res.json(invites);
  });

  // @desc Create new invite for club
  // @route POST /clubs/:clubId/invites
  // @access Private
  createClubInvite = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const inviterId = req.user.id;
    const { inviteeId } = req.body;
    const inputInviteData = {
      clubId,
      inviterId,
      inviteeId,
      expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //Expires in one week
    };
    const validatedData =
      ClubInviteValidator.validateNewInviteSchema(inputInviteData);
    const id = await ClubsService.createClubInvite(validatedData);
    res.json({
      message: `Invite with id ${id} was created`,
    });
  });

  // @desc delete invite for club
  // @route DELETE /clubs/:clubId/invites/:inviteId
  // @access Private
  deleteClubInvite = expressAsyncHandler(async (req, res) => {
    const inviteId = parseInt(req.params.inviteId);
    const userId = req.user.id;
    const inputInviteData = {
      id: inviteId,
      userId,
    };
    const validatedData =
      ClubInviteValidator.validateDeleteInviteSchema(inputInviteData);
    const id = await ClubsService.deleteClubInvite(validatedData);
    res.json({
      message: `Invite with id ${id} was deleted`,
    });
  });

  //CLUB MEMBERS

  // @desc Get current members for club
  // @route GET /clubs/:clubId/members?cursor
  // @access Private
  getClubMembers = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const invites = await ClubsService.getClubMembers(userId, clubId, cursor);
    res.json(invites);
  });

  // @desc Add current user to public club
  // @route POST /clubs/:clubId/members
  // @access Private
  addClubMember = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const inputClubMemberData = { clubId, userId };
    const validatedMember =
      ClubMembersValidator.validateNewClubMemberSchema(inputClubMemberData);
    const resId = await ClubsService.addClubMember(validatedMember);
    res.json({ message: `Member ${resId} added to club` });
  });

  // @desc Update member permissions for given club
  // @route PATCH /clubs/:clubId/members/:memberId
  // @access Private
  updateClubMemberRole = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const memberId = parseInt(req.params.memberId);
    const userId = parseInt(req.user.id);
    const { role } = req?.body;
    const inputClubMemberData = {
      id: memberId,
      role,
      userId,
      clubId,
    };
    const validatedData =
      ClubMembersValidator.validateUpdateClubMemberSchema(inputClubMemberData);
    await ClubsService.updateClubMember(validatedData);
    res.json({ message: `Member ${memberId} successfully updated` });
  });

  // @desc remove member from given club
  // @route DELETE /clubs/:clubId/members/:memberId
  // @access Private
  deleteClubMember = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const memberId = parseInt(req.params.memberId);
    const userId = parseInt(req.user.id);
    const inputClubMemberData = {
      id: memberId,
      userId,
      clubId,
    };
    const validatedData =
      ClubMembersValidator.validateDeleteClubMemberSchema(inputClubMemberData);
    const delId = await ClubsService.removeClubMember(validatedData);
    res.json({ message: `Member ${delId} successfully removed` });
  });

  //CLUB MEDIA

  // @desc get media for a given club
  // @route GET /clubs/:clubId/media?cursor
  // @access Private
  getClubMedia = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const clubMedia = await ClubsService.getClubMedia(userId, clubId, cursor);
    res.json(clubMedia);
  });

  // @desc add new media for a given club
  // @route POST /clubs/:clubId/media
  // @access Private
  addClubMedia = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const { mediaId, media } = req.body;
    const inputClubMediaData = {
      assignedBy: userId,
      mediaId,
      clubId,
      media,
    };
    const validatedData =
      ClubMediaValidator.validateNewClubMediaSchema(inputClubMediaData);
    const newId = await ClubsService.addClubMedia(validatedData);
    res.json({ message: `New club media with id ${newId} added` });
  });

  // @desc delete a club media for a give club
  // @route DELETE /clubs/:clubId/media/:clubMediaId
  // @access Private
  deleteClubMedia = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const userId = parseInt(req.user.id);
    const role = req.user.role;
    const inputClubMediaData = {
      id: clubMediaId,
      userId,
      clubId,
      role,
    };
    const validatedData =
      ClubMediaValidator.validateDeleteClubMediaSchema(inputClubMediaData);
    const delId = await ClubsService.deleteClubMedia(validatedData);
    res.json({ message: `Club media with id ${delId} deleted` });
  });

  //CLUB THREADS

  // @desc get threads for a given club media
  // @route GET /clubs/:clubId/media/:clubMediaId/threads?cursor
  // @access Private
  getClubThreads = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const cursor = req.query.cursor || null;
    const { threads, nextCursor, hasMore } = await ClubsService.getClubThreads(
      userId,
      clubId,
      clubMediaId,
      cursor
    );
    res.json({
      threads,
      nextCursor,
      hasMore,
    });
  });

  // @desc add new thread for a given club media
  // @route POST /clubs/:clubId/media/:clubMediaId/threads
  // @access Private
  addClubThread = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const { title } = req.body;
    const inputThreadData = {
      clubMediaId,
      userId,
      clubId,
      title,
    };
    const validatedData =
      ClubThreadsValidator.validateNewThreadSchema(inputThreadData);
    const newId = await ClubsService.addClubThread(validatedData);
    res.json({ message: `New club thread with id ${newId} added` });
  });

  // @desc Update thread title
  // @route PATCH /clubs/:clubId/media/:clubMediaId/threads/:threadId
  // @access Private
  updateThreadTitle = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const threadId = parseInt(req.params.threadId);
    const { title } = req.body;
    const inputThreadData = {
      id: threadId,
      clubMediaId,
      userId,
      clubId,
      title,
    };
    const validatedData =
      ClubThreadsValidator.validateUpdateThreadSchema(inputThreadData);
    await ClubsService.updateClubThread(validatedData);
    res.json({ message: `Thread with id ${threadId} updated` });
  });

  // @desc delete a thread for a given club media
  // @route DELETE /clubs/:clubId/media/:clubMediaId/threads/:threadId
  // @access Private
  deleteClubThread = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const role = req.user.role;
    const threadId = parseInt(req.params.threadId);
    const inputThreadData = {
      id: threadId,
      clubMediaId,
      userId,
      clubId,
      role,
    };
    const validatedData =
      ClubThreadsValidator.validateDeleteThreadSchema(inputThreadData);
    await ClubsService.deleteClubThread(validatedData);
    res.json({ message: `Thread with id ${threadId} deleted` });
  });

  //CLUB THREAD COMMENTS

  // @desc get thread comments for a given club thread
  // @route GET /clubs/:clubId/media/:clubMediaId/threads/:threadId/comments
  // @access Private
  getClubThreadComments = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const threadId = parseInt(req.params.threadId);
    const commentData = await ClubsService.getClubThreadComments(
      userId,
      clubId,
      threadId
    );
    res.json(commentData);
  });

  // @desc get replies for a given thread comment
  // @route GET /clubs/:clubId/media/:clubMediaId/threads/:threadId/comments/:commentId/replies?cursor
  // @access Private
  getCommentReplies = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const commentId = parseInt(req.params.commentId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const replies = await ClubsService.getCommentReplies(
      userId,
      clubId,
      commentId,
      cursor
    );
    res.json(replies);
  });

  // @desc add new comment for a given thread
  // @route POST /clubs/:clubId/media/:clubMediaId/threads/:threadId/comments
  // @access Private
  addClubThreadComment = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const threadId = parseInt(req.params.threadId);
    const { content, parentId } = req.body;
    const inputData = {
      threadId,
      userId,
      content,
      clubId,
      clubMediaId,
    };

    if (parentId) inputData.parentId = parentId;
    const validatedData =
      ClubThreadCommentValidator.validateNewThreadCommentSchema(inputData);
    const newId = await ClubsService.addClubThreadComment(validatedData);
    res.json({ message: `New comment with id ${newId} added` });
  });

  // @desc update comment for a given thread
  // @route PATCH /clubs/:clubId/media/:clubMediaId/threads/:threadId/comments/:commentId
  // @access Private
  updateClubThreadComment = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMediaId = parseInt(req.params.clubMediaId);
    const threadId = parseInt(req.params.threadId);
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;
    const inputData = {
      id: commentId,
      threadId,
      userId,
      content,
      clubId,
      clubMediaId,
    };
    const validatedData =
      ClubThreadCommentValidator.validateUpdateThreadCommentSchema(inputData);
    await ClubsService.updateClubThreadComment(validatedData);
    res.json({ message: `Comment with id ${commentId} updated` });
  });

  // @desc delete a thread comment
  // @route DELETE /clubs/:clubId/media/:clubMediaId/threads/:threadId/comments/:commentId
  // @access Private
  deleteClubThreadComment = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const role = req.user.role;
    const clubMediaId = parseInt(req.params.clubMediaId);
    const threadId = parseInt(req.params.threadId);
    const commentId = parseInt(req.params.commentId);
    const inputData = {
      id: commentId,
      threadId,
      userId,
      clubId,
      clubMediaId,
      role,
    };
    const validatedData =
      ClubThreadCommentValidator.validateDeleteThreadCommentSchema(inputData);
    await ClubsService.deleteClubThreadComment(validatedData);
    res.json({ message: `Comment with id ${commentId} deleted` });
  });

  //CLUB REVIEW SHARES

  // @desc share private review to club
  // @route POST /clubs/:clubId/media/:clubMediaId/reviews/:reviewId/share
  // @access Private
  shareReview = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const reviewId = parseInt(req.params.reviewId);
    const newId = await ReviewsService.shareReviewToClub(
      reviewId,
      clubId,
      userId
    );
    res.json({ message: `New review share with id ${newId} added` });
  });

  // @desc remove review share from club
  // @route DELETE /clubs/:clubId/media/:clubMediaId/reviews/:reviewId/share/:shareId
  // @access Private
  removeReviewShare = expressAsyncHandler(async (req, res) => {
    const userId = parseInt(req.user.id);
    const shareId = parseInt(req.params.shareId);
    const delId = await ReviewsService.removeReviewShare(shareId, userId);
    res.json({ message: `Review share with id ${delId} removed` });
  });
}

export default new ClubsController();
