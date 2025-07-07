import ReviewsDao from "../dao/reviewsDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import ReviewsValidator from "../validators/reviewsValidator.js";

class ReviewsService {
  async getAllReviews() {
    try {
      const reviews = await ReviewsDao.getAllReviews();
      return reviews;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async createReview(inputReviewData) {
    try {
      const validatedData = await ReviewsValidator.validateNewReview(
        inputReviewData
      );
      const newReviewId = await ReviewsDao.createReview(validatedData);
      return newReviewId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateReview(inputReviewData, requestUserId) {
    try {
      const { id } = inputReviewData;
      const userId = await ReviewsDao.getReviewAuthor(id);
      if (userId !== requestUserId) {
        throw AppError.forbidden(
          "You are not authorized to modify this review."
        );
      }
      const validatedData = await ReviewsValidator.validateUpdateReview({
        userId,
        ...inputReviewData,
      });
      await ReviewsDao.updateReview(validatedData);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteReview(inputReviewData, requestUserId) {
    try {
      const validatedData = await ReviewsValidator.validateDeleteReview(
        inputReviewData
      );
      const { id } = validatedData;
      const userId = await ReviewsDao.getReviewAuthor(id);
      if (userId !== requestUserId) {
        throw AppError.forbidden(
          "You are not authorized to modify this review."
        );
      }
      const delReview = await ReviewsDao.deleteReview(validatedData);
      return delReview;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getReviewById(inputReviewData) {
    try {
      const { id } = inputReviewData;
      const review = await ReviewsDao.getReviewById(id);
      return review;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new ReviewsService();
