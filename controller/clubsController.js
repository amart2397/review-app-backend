import expressAsyncHandler from "express-async-handler";
import ClubsService from "../service/clubsService.js";
import ClubsValidator from "../validators/clubsValidator.js";

class ClubsController {
  // @desc Get all public clubs
  // @route GET /clubs
  // @access Private
  getAllPublicClubs = expressAsyncHandler(async (req, res) => {
    const clubs = await ClubsService.getPublicClubs();
    res.json(clubs);
  });

  createClub = expressAsyncHandler(async (req, res) => {
    const { name, description, mediaType, isPrivate } = req.body;
    const creatorId = req.user.id;
    const inputClubData = {
      name,
      description,
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
}

export default new ClubsController();
