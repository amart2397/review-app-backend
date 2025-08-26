import * as z from "zod/v4";
import ClubsDao from "../dao/clubsDao.js";
import compareSchema from "./helpers/compareSchema.js";
import env from "dotenv";
import AppError from "../utils/AppError.js";
env.config();

const newClubSchema = z.object({
  name: z.string(),
  creatorId: z.int(),
  mediaType: z.enum(["book", "movie"]),
  isPrivate: z.boolean(),
});

const updateClubSchema = z.object({
  id: z.int(),
  userId: z.int(),
  name: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

const deleteClubSchema = z.object({
  id: z.int(),
  userId: z.int(),
  role: z.string(),
});

class ClubsValidator {
  //schema validation (using zod)
  validateNewClubSchema(inputClubData) {
    return compareSchema(newClubSchema, inputClubData);
  }
  validateUpdateClubSchema(inputClubData) {
    return compareSchema(updateClubSchema, inputClubData);
  }
  validateDeleteClubSchema(inputClubData) {
    return compareSchema(deleteClubSchema, inputClubData);
  }

  //app logic validation
  async validateNewClub(inputClubData) {
    const { creatorId } = inputClubData;
    const clubs = await ClubsDao.getClubsByCreator(creatorId);
    //Limit users to a maximum amount of clubs to maintain size of app
    if (clubs?.length === Number(process.env.MAX_CLUBS_BY_USER)) {
      throw AppError.forbidden(
        "Already created max clubs, please delete a club first"
      );
    }
    return inputClubData;
  }
  async validateUpdateClub(inputClubData) {
    const { id, userId } = inputClubData;
    const club = await ClubsDao.getClubById(id);
    if (!club) {
      throw AppError.badRequest("Club not found");
    }
    if (club.creator?.id !== userId) {
      throw AppError.forbidden("You are not authorized to modify this club.");
    }
    return inputClubData;
  }
  async validateDeleteClub(inputClubData) {
    const { id, userId, role } = inputClubData;
    const club = await ClubsDao.getClubById(id);
    if (!club) {
      throw AppError.badRequest("Club not found");
    }
    if (role !== "admin") {
      if (club.creator?.id !== userId) {
        throw AppError.forbidden("You are not authorized to modify this club.");
      }
    }
    return inputClubData;
  }
}

export default new ClubsValidator();
