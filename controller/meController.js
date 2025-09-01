import expressAsyncHandler from "express-async-handler";
import ClubsService from "../service/clubsService.js";
import ClubInviteValidator from "../validators/clubInviteValidator.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";
import AppError from "../utils/AppError.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ReviewsService from "../service/reviewsService.js";
import FeedService from "../service/feedService.js";

class MeController {
  // @desc get basic user info for req session
  // @route GET /me
  // @access Private
  getMe = expressAsyncHandler((req, res, next) => {
    const { id, first_name, last_name, role } = req?.user;
    const user = {
      id,
      firstName: first_name,
      lastName: last_name,
      role,
    };
    res.json(user);
  });

  // @desc get user clubs for req session
  // @route GET /me/clubs?cursor
  // @access Private
  getMyClubs = expressAsyncHandler(async (req, res, next) => {
    const userId = parseInt(req.user.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const myClubs = await ClubsService.getUserClubs(userId, cursor);
    res.json(myClubs);
  });

  // @desc get user invites for req session
  // @route GET /me/clubs/invites
  // @access Private
  getMyInvites = expressAsyncHandler(async (req, res, next) => {
    const userId = parseInt(req.user.id);
    const myInvites = await ClubsService.getUserInvites(userId);
    res.json(myInvites);
  });

  // @desc send invite response
  // @route POST /me/clubs/:clubId/invites/:inviteId
  // @access Private
  respondToInvite = expressAsyncHandler(async (req, res, next) => {
    const userId = parseInt(req.user.id);
    const inviteId = parseInt(req.params.inviteId);
    const clubId = parseInt(req.params.clubId);
    const { accepted: response } = req.body;
    if (typeof response !== "boolean") {
      throw AppError.badRequest(
        "response body must include `accepted` as a boolean"
      );
    }
    const accepted = Boolean(response);

    const inputInviteData = { id: inviteId, userId };
    const inputClubMemberData = { clubId, userId };

    const validatedInvite =
      ClubInviteValidator.validateDeleteInviteSchema(inputInviteData);
    const validatedMember =
      ClubMembersValidator.validateNewClubMemberSchema(inputClubMemberData);

    const resId = await ClubsService.respondToInvite({
      inputInviteData: validatedInvite,
      inputClubMemberData: validatedMember,
      accepted,
    });

    let message;
    if (accepted) {
      message = `Member ${resId} added to club`;
    } else {
      message = `Invite ${resId} deleted`;
    }

    res.json({
      message,
    });
  });

  // @desc delete current user's club membership
  // @route DELETE /me/clubs/:clubId/member
  // @access Private
  removeFromClub = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const userId = parseInt(req.user.id);
    const member = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    const memberId = member?.memberId;
    if (!memberId) {
      throw AppError.badRequest("You are not a member of this club");
    }
    const inputDelData = { id: memberId, userId, clubId };
    const validatedData =
      ClubMembersValidator.validateDeleteClubMemberSchema(inputDelData);
    const delId = await ClubsService.removeClubMember(validatedData);
    res.json({
      message: `successfully removed from club with member Id ${delId}`,
    });
  });

  // @desc get current users reviews
  // @route GET /me/reviews?cursor
  // @access Private
  getMyReviews = expressAsyncHandler(async (req, res) => {
    const currentUserId = parseInt(req.user.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const reviews = await ReviewsService.getMyReviews(currentUserId, cursor);
    res.json(reviews);
  });

  // @desc get current users feed
  // @route GET /me/feed?reviewsCursor&clubMediaCursor&clubThreadCursor
  // @access Private
  getMyFeed = expressAsyncHandler(async (req, res) => {
    const currentUserId = parseInt(req.user.id);
    const reviewsCursor = req.query.reviewsCursor
      ? parseInt(req.query.reviewsCursor)
      : null;
    const clubMediaCursor = req.query.clubMediaCursor
      ? parseInt(req.query.clubMediaCursor)
      : null;
    const clubThreadCursor = req.query.clubThreadCursor
      ? parseInt(req.query.clubThreadCursor)
      : null;
    const cursors = {
      reviewsCursor,
      clubMediaCursor,
      clubThreadCursor,
    };
    const feed = await FeedService.getUserFeed(currentUserId, cursors);
    res.json(feed);
  });
}

export default new MeController();
