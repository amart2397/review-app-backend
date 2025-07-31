import * as z from "zod/v4";
import ClubsDao from "../dao/clubsDao.js";
import compareSchema from "./helpers/compareSchema.js";
import env from "dotenv";
import AppError from "../utils/AppError.js";
env.config();

const newClubSchema = z.object({
  name: z.string(),
  description: z.string(),
  creatorId: z.int(),
  mediaType: z.enum(["book", "movie"]),
  isPrivate: z.boolean(),
});

class ClubsValidator {
  //schema validation (using zod)
  validateNewClubSchema(inputClubData) {
    return compareSchema(newClubSchema, inputClubData);
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
}

export default new ClubsValidator();
