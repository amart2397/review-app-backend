import ClubMediaDao from "../dao/clubMediaDao.js";
import MediaDao from "../dao/mediaDao.js";
import ReviewClubSharesDao from "../dao/reviewClubSharesDao.js";
import ReviewsDao from "../dao/reviewsDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import ClubMediaValidator from "../validators/clubMediaValidator.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";
import MediaValidator from "../validators/mediaValidator.js";
import ReviewClubSharesValidator from "../validators/reviewClubSharesValidator.js";
import ReviewsValidator from "../validators/reviewsValidator.js";

class ReviewsService {
  async getPublicReviews(cursor = null) {
    try {
      const reviews = await ReviewsDao.getPublicReviews(cursor);
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

  async shareReviewToClub(reviewId, clubId, userId) {
    try {
      await ReviewClubSharesValidator.validateNewReviewShare(
        reviewId,
        clubId,
        userId
      );
      const newId = await ReviewClubSharesDao.addReviewClubShare(
        reviewId,
        clubId
      );
      return newId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async removeReviewShare(shareId, userId) {
    try {
      await ReviewClubSharesValidator.validateDeleteReviewShare(
        shareId,
        userId
      );
      const delId = await ReviewClubSharesDao.deleteReviewClubShare(shareId);
      return delId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getReviewsByMedia(currentUserId, mediaId, cursor = null) {
    try {
      const reviews = await ReviewsDao.getReviewsByMedia(
        mediaId,
        currentUserId,
        cursor
      );
      return reviews;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getReviewsByUser(currentUserId, userId, cursor = null) {
    try {
      const reviews = await ReviewsDao.getReviewsByUser(
        userId,
        currentUserId,
        cursor
      );
      return reviews;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getMyReviews(userId, cursor = null) {
    try {
      const reviews = await ReviewsDao.getMyReviews(userId, cursor);
      return reviews;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getReviewsByClubMedia(
    clubMediaId,
    clubId,
    currentUserId,
    cursor = null
  ) {
    try {
      await ClubMediaValidator.validateClubMediaAndClub(clubMediaId, clubId);
      await ClubMembersValidator.validateUserIsClubMember(
        currentUserId,
        clubId
      );
      const clubMedia = await ClubMediaDao.getClubMediaById(
        clubMediaId,
        clubId
      );
      const mediaId = clubMedia.mediaId;
      const reviews = await ReviewsDao.getReviewsByClubMedia(
        mediaId,
        clubId,
        cursor
      );
      return reviews;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getUserReviewForMedia(currentUserId, mediaId, clubId = null) {
    try {
      const review = await ReviewsDao.getReviewByAuthorAndMedia(
        currentUserId,
        mediaId
      );
      if (clubId) {
        const reviewShare =
          await ReviewClubSharesDao.getReviewClubShareByClubAndReviewId(
            clubId,
            review?.reviews?.[0]?.id
          );
        if (!reviewShare) {
          review.shared = false;
        } else {
          review.shared = true;
        }
      }
      return review;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new ReviewsService();
