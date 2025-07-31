import expressAsyncHandler from "express-async-handler";
import ReviewsService from "../service/reviewsService.js";
import AppError from "../utils/AppError.js";
import ReviewsValidator from "../validators/reviewsValidator.js";

class ReviewsController {
  // @desc Get all reviews
  // @route GET /reviews
  // @access Public
  getAllReviews = expressAsyncHandler(async (req, res) => {
    const reviews = await ReviewsService.getAllReviews();
    if (reviews?.length === 0) {
      throw AppError.badRequest("No reviews found");
    }
    res.json(reviews);
  });

  // @desc create new review
  // @route POST /reviews
  // @access Private
  createReview = expressAsyncHandler(async (req, res) => {
    const { mediaId, reviewTitle, reviewText, reviewRating, media } = req.body;
    const userId = req.user.id;
    if (media && media.mediaKey != null) {
      media.mediaKey = String(media.mediaKey);
    }
    const inputReviewData = {
      userId,
      mediaId,
      reviewTitle,
      reviewText,
      reviewRating,
      media,
    };
    const validatedData =
      ReviewsValidator.validateNewReviewSchema(inputReviewData);
    const newReviewId = await ReviewsService.createReview(validatedData);
    res.status(201).json({
      message: `New review ${reviewTitle} with id ${newReviewId} created`,
    });
  });

  // @desc Get specific review
  // @route GET /reviews/:id
  // @access Public
  getReview = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const inputData = { id };
    const validatedData = ReviewsValidator.validateReviewIdSchema(inputData);
    const review = await ReviewsService.getReviewById(validatedData);
    if (review?.length === 0) {
      throw AppError.badRequest("Review not found");
    }
    res.json(review);
  });

  // @desc Update a review
  // @route PATCH /reviews/:id
  // @access Private
  updateReview = expressAsyncHandler(async (req, res) => {
    const {
      id: id_body,
      mediaId,
      reviewTitle,
      reviewText,
      reviewRating,
    } = req.body;
    const id = parseInt(req.params.id);
    const requestUserId = req.user.id;
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputReviewData = {
      id,
      mediaId,
      userId: requestUserId,
      reviewTitle,
      reviewText,
      reviewRating,
    };
    const validatedData =
      ReviewsValidator.validateUpdateReviewSchema(inputReviewData);
    await ReviewsService.updateReview(validatedData);
    res.json({
      message: `Review with id ${id} updated`,
    });
  });

  // @desc Delete a review
  // @route DELETE /reviews/:id
  // @access Private
  deleteReview = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { id: id_body } = req.body;
    const requestUserId = req.user.id;
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputReviewData = { id, userId: requestUserId };
    const validatedData =
      ReviewsValidator.validateReviewIdSchema(inputReviewData);
    const { id: review_id, review_title } = await ReviewsService.deleteReview(
      validatedData
    );
    res.json({
      message: `Review: ${review_title} with id ${review_id} was deleted`,
    });
  });
}

export default new ReviewsController();
