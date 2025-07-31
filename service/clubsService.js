import ClubsDao from "../dao/clubsDao.js";
import ClubsValidator from "../validators/clubsValidator.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";

class ClubsService {
  async getPublicClubs() {
    try {
      const clubs = await ClubsDao.getPublicClubs();
      return clubs;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async createClub(inputClubData) {
    try {
      const validatedData = await ClubsValidator.validateNewClub(inputClubData);
      const newClubId = await ClubsDao.createClub(validatedData);
      return newClubId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new ClubsService();
