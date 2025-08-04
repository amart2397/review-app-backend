import expressAsyncHandler from "express-async-handler";
import ClubsService from "../service/clubsService.js";
import ClubsValidator from "../validators/clubsValidator.js";
import AppError from "../utils/AppError.js";

class ClubsController {
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
    const id = parseInt(req.params.id);
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

  deleteClub = expressAsyncHandler(async (req, res) => {
    const { id: id_body } = req?.body;
    const userId = req.user.id;
    const id = parseInt(req.params.id);
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
}

export default new ClubsController();
