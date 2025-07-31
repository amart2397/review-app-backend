import MediaDao from "../dao/mediaDao.js";
import ReviewsDao from "../dao/reviewsDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import MediaValidator from "../validators/mediaValidator.js";
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
      const reviewData = { ...inputReviewData };
      //check if a media id has already been provided or needs to be generated
      if (!reviewData.mediaId) {
        const { media } = reviewData;
        const checkMedia = await MediaDao.getMediaByKey(media.mediaKey);
        if (checkMedia) {
          reviewData.mediaId = checkMedia.id;
        } else {
          const validatedMedia = await MediaValidator.validateNewMedia(media);
          const newMediaId = await MediaDao.createMedia(validatedMedia);
          reviewData.mediaId = newMediaId;
        }
      }
      if ("media" in reviewData) delete reviewData.media;

      const validatedData = await ReviewsValidator.validateNewReview(
        reviewData
      );
      const newReviewId = await ReviewsDao.createReview(validatedData);
      return newReviewId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateReview(inputReviewData) {
    try {
      const validatedData = await ReviewsValidator.validateUpdateReview(
        inputReviewData
      );
      await ReviewsDao.updateReview(validatedData);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteReview(inputReviewData) {
    try {
      const validatedData = await ReviewsValidator.validateDeleteReview(
        inputReviewData
      );
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
