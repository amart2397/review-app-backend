import ReviewsDao from "../dao/reviewsDao.js";
import ClubMediaDao from "../dao/clubMediaDao.js";
import AppError from "../utils/AppError.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ReviewClubSharesDao from "../dao/reviewClubSharesDao.js";

class ReviewClubSharesValidator {
  async validateNewReviewShare(reviewId, clubId, userId) {
    const review = await ReviewsDao.getReviewById(reviewId);
    if (!review) {
      throw AppError.badRequest("Review id does not exist");
    }
    const reviewMediaId = review.media.id;
    const clubMediaCheck = await ClubMediaDao.getClubMediaByClubAndMediaId(
      clubId,
      reviewMediaId
    );
    const member = await ClubMembersDao.getMemberByUserAndClub(userId, clubId);
    if (!member) {
      throw AppError.forbidden("You are not a member of this club");
    }
    if (review.author.id !== userId) {
      throw AppError.forbidden("You are not authorized to share this review");
    }
    if (!review.private) {
      throw AppError.badRequest("Review is public");
    }
    if (!clubMediaCheck) {
      throw AppError.badRequest("Club does not have associated review media");
    }
  }

  async validateDeleteReviewShare(shareId, userId) {
    const share = await ReviewClubSharesDao.getReviewClubShareById(shareId);
    if (!share) {
      throw AppError.badRequest("Review share id cannot be found");
    }
    const review = await ReviewsDao.getReviewById(share.review_id);
    if (!review) {
      throw AppError.badRequest("Review id cannot be found");
    }
    if (review.author.id !== userId) {
      throw AppError.forbidden("You are not authorized to remove this share");
    }
  }
}

export default new ReviewClubSharesValidator();
