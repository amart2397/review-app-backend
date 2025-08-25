import db from "../db/db.js";
import {
  transformReviewData,
  transformReturnReviewData,
} from "../transformers/transformData.js";
import { reviewsColumnsToReturn } from "./config/returnColumnsConfig.js";

class ReviewsDao {
  async getAllReviews() {
    const reviewsRaw = await db("reviews")
      .join("users", "reviews.user_id", "users.id")
      .join("media", "reviews.media_id", "media.id")
      .where("reviews.private", false) //Only fetch public reviews
      .select(reviewsColumnsToReturn);
    const reviews = reviewsRaw.map((entry) => transformReturnReviewData(entry));
    return reviews;
  }

  async createReview(inputReviewData) {
    const transformedData = transformReviewData(inputReviewData);
    const [{ id }] = await db("reviews")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async updateReview(inputReviewData) {
    const transformedData = transformReviewData(inputReviewData);
    await db("reviews").where("id", transformedData.id).update(transformedData);
  }

  async deleteReview(inputReviewData) {
    const { id } = inputReviewData;
    const [delReview] = await db("reviews")
      .where("id", id)
      .returning(["id", "review_title"])
      .del();
    return delReview;
  }

  //helper queries
  async getReviewById(id) {
    const reviewRaw = await db("reviews")
      .join("users", "reviews.user_id", "users.id")
      .join("media", "reviews.media_id", "media.id")
      .first(reviewsColumnsToReturn)
      .where("reviews.id", id);
    const review = transformReturnReviewData(reviewRaw);
    return review;
  }

  async getReviewsByAuthorId(userId) {
    const reviewsRaw = await db("reviews")
      .join("users", "reviews.user_id", "users.id")
      .join("media", "reviews.media_id", "media.id")
      .select(reviewsColumnsToReturn)
      .where("reviews.user_id", userId);
    const reviews = reviewsRaw.map((entry) => transformReturnReviewData(entry));
    return reviews;
  }

  async getReviewsByMediaId(mediaId) {
    const reviewsRaw = await db("reviews")
      .join("users", "reviews.user_id", "users.id")
      .join("media", "reviews.media_id", "media.id")
      .select(reviewsColumnsToReturn)
      .where("reviews.media_id", mediaId);
    const reviews = reviewsRaw.map((entry) => transformReturnReviewData(entry));
    return reviews;
  }

  async getReviewByAuthorAndMedia(userId, mediaId) {
    const reviewRaw = await db("reviews")
      .join("users", "reviews.user_id", "users.id")
      .join("media", "reviews.media_id", "media.id")
      .first(reviewsColumnsToReturn)
      .where("users.id", userId)
      .andWhere("media.id", mediaId);
    const review = transformReturnReviewData(reviewRaw);
    return review;
  }

  //Added for auth checks
  async getReviewAuthor(reviewId) {
    const { user_id } = await db("reviews")
      .first("user_id")
      .where("reviews.id", reviewId);
    return user_id;
  }
}

export default new ReviewsDao();
