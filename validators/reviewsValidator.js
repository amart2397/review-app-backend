import * as z from "zod/v4";
import ReviewsDao from "../dao/reviewsDao.js";
import UsersDao from "../dao/usersDao.js";
import MediaDao from "../dao/mediaDao.js";
import AppError from "../utils/AppError.js";
import compareSchema from "./helpers/compareSchema.js";

//Data schemas
const newReviewSchema = z
  .object({
    userId: z.int(),
    mediaId: z.int().nullable().optional(),
    reviewTitle: z.string(),
    reviewText: z.string(),
    reviewRating: z.number().nonnegative().multipleOf(0.1).max(10),
    media: z
      .object({
        //Allow new media to be passed in with reviews
        mediaType: z.string(),
        mediaKey: z.string(),
        title: z.string(),
        description: z.string().optional(),
        releaseDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .or(z.literal("")),
        imgSmall: z.url().optional(),
        imgLarge: z.url().optional(),
        genres: z.array(z.string()).optional(),
        runtime: z.number().optional(),
        authors: z.string().optional(),
        publisher: z.string().optional(),
        pageCount: z.number().optional(),
      })
      .optional(),
  })
  .refine((review) => review.mediaId != null || review.media != null, {
    message: "Must provide a media id or media object",
    path: ["media"],
  });

const updateReviewSchema = z.object({
  //userId not provided because author shouldn't ever be changed
  id: z.int(),
  mediaId: z.int(),
  reviewTitle: z.string(),
  reviewText: z.string(),
  reviewRating: z.number().nonnegative().multipleOf(0.1).max(10),
});

const reviewIdSchema = z.object({
  id: z.int(),
});

class ReviewsValidator {
  //schema validation (using zod)
  validateNewReviewSchema(inputReviewData) {
    return compareSchema(newReviewSchema, inputReviewData);
  }

  validateReviewIdSchema(inputReviewData) {
    return compareSchema(reviewIdSchema, inputReviewData);
  }

  validateUpdateReviewSchema(inputReviewData) {
    return compareSchema(updateReviewSchema, inputReviewData);
  }

  //app logic validation
  async validateNewReview(inputReviewData) {
    const { userId, mediaId } = inputReviewData;
    const existingReview = await ReviewsDao.getReviewByAuthorAndMedia(
      userId,
      mediaId
    );
    if (existingReview) {
      throw AppError.conflict("User already created review");
    }
    const author = await UsersDao.getUserById(userId);
    if (!author) {
      throw AppError.badRequest("Review author not found");
    }
    const media = await MediaDao.getMediaById(mediaId);
    if (!media) {
      throw AppError.badRequest("Review media not found");
    }
    return inputReviewData;
  }

  async validateUpdateReview(inputReviewData) {
    const { id, userId, mediaId } = inputReviewData;
    const existingReviewById = await ReviewsDao.getReviewById(id);
    const existingReviewByAuthor = await ReviewsDao.getReviewByAuthorAndMedia(
      userId,
      mediaId
    );
    //Review post checks
    if (existingReviewById && existingReviewById?.author?.id !== userId) {
      throw AppError.badRequest("Review author cannot be changed");
    }
    if (existingReviewByAuthor && existingReviewByAuthor?.id !== id) {
      throw AppError.conflict("User already created review");
    }
    if (!existingReviewById) {
      throw AppError.badRequest("Review not found");
    }
    //Author & media checks
    const author = await UsersDao.getUserById(userId);
    if (!author) {
      throw AppError.badRequest("Review author not found");
    }
    const media = await MediaDao.getMediaById(mediaId);
    if (!media) {
      throw AppError.badRequest("Review media not found");
    }
    return inputReviewData;
  }

  async validateDeleteReview(inputReviewData) {
    const { id } = inputReviewData;
    const existingReview = await ReviewsDao.getReviewById(id);
    if (!existingReview) {
      throw AppError.badRequest("Review not found");
    }
    return inputReviewData;
  }
}

export default new ReviewsValidator();
