import expressAsyncHandler from "express-async-handler";
import ClubsService from "../service/clubsService.js";
import ClubInviteValidator from "../validators/clubInviteValidator.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";
import AppError from "../utils/AppError.js";

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
  // @route GET /me/clubs
  // @access Private
  getMyClubs = expressAsyncHandler(async (req, res, next) => {
    const userId = parseInt(req.user.id);
    const myClubs = await ClubsService.getUserClubs(userId);
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
}

export default new MeController();
