import expressAsyncHandler from "express-async-handler";
import ClubsService from "../service/clubsService.js";
import ClubsValidator from "../validators/clubsValidator.js";
import AppError from "../utils/AppError.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";
import ClubInviteValidator from "../validators/clubInviteValidator.js";
import ClubMediaValidator from "../validators/clubMediaValidator.js";
import ClubThreadsValidator from "../validators/clubThreadsValidator.js";

class ClubsController {
  //CLUBS

  // @desc Get all public clubs
  // @route GET /clubs
  // @access Private
  getAllPublicClubs = expressAsyncHandler(async (req, res) => {
    const clubs = await ClubsService.getPublicClubs();
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
    const id = parseInt(req.params.clubId);
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputClubData = { id, userId };
    const validatedData =
      ClubsValidator.validateDeleteClubSchema(inputClubData);
    const { id: club_id, name } = await ClubsService.deleteClub(validatedData);
    res.json({
      message: `Club: ${name} with id ${club_id} was deleted`,
    });
  });

  //CLUB INVITES

  // @desc Get current invites for club
  // @route GET /clubs/:clubId/invites
  // @access Private
  getClubInvites = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const invites = await ClubsService.getClubInvites(userId, clubId);
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
  // @route GET /clubs/:clubId/members
  // @access Private
  getClubMembers = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const invites = await ClubsService.getClubMembers(userId, clubId);
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
  // @route GET /clubs/:clubId/media
  // @access Private
  getClubMedia = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const clubMedia = await ClubsService.getClubMedia(userId, clubId);
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
    const inputClubMediaData = {
      id: clubMediaId,
      userId,
      clubId,
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

  // @desc Update member permissions for given club
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
    const threadId = parseInt(req.params.threadId);
    const inputThreadData = {
      id: threadId,
      clubMediaId,
      userId,
      clubId,
    };
    const validatedData =
      ClubThreadsValidator.validateDeleteThreadSchema(inputThreadData);
    await ClubsService.deleteClubThread(validatedData);
    res.json({ message: `Thread with id ${threadId} deleted` });
  });
}

export default new ClubsController();
