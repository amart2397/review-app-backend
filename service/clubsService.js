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

  async updateClub(inputClubData) {
    try {
      const validatedData = await ClubsValidator.validateUpdateClub(
        inputClubData
      );
      await ClubsDao.updateClub(validatedData);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClub(inputClubData) {
    try {
      const validatedData = await ClubsValidator.validateDeleteClub(
        inputClubData
      );
      const delClub = await ClubsDao.deleteClub(validatedData);
      return delClub;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new ClubsService();
