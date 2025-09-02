import db from "../db/db.js";
import {
  transformReviewData,
  transformReturnReviewData,
} from "../transformers/transformData.js";
import { reviewsColumnsToReturn } from "./config/returnColumnsConfig.js";

class ReviewsDao {
  async getPublicReviews(cursor = null, limit = 20) {
    //Only fetch public reviews
    const reviewsRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .where("r.private", false)
      .select(reviewsColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("r.id", "<", cursor);
        }
      })
      .orderBy("r.id", "desc")
      .limit(limit);
    const reviews = transformReturnReviewData(reviewsRaw);
    return reviews;
  }

  async getReviewsByMedia(mediaId, currentUserId, cursor = null, limit = 20) {
    const reviewsRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .leftJoin("review_club_shares as rcs", "r.id", "rcs.review_id")
      .leftJoin("club_members as cm", function () {
        this.on("cm.club_id", "rcs.club_id").andOnVal(
          "cm.user_id",
          currentUserId
        );
      })
      .where("r.media_id", mediaId)
      .andWhere((qb) => {
        qb.where("r.private", false).orWhereNotNull("cm.user_id");
      })
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("r.id", "<", cursor);
        }
      })
      .groupBy("r.id", "u.id", "m.id")
      .select([
        ...reviewsColumnsToReturn,
        db.raw("array_remove(array_agg(rcs.club_id), null) as clubs"),
      ])
      .orderBy("r.id", "desc")
      .limit(limit);
    const reviews = transformReturnReviewData(reviewsRaw);
    return reviews;
  }

  async getReviewsByUser(
    userId,
    currentUserId = null,
    cursor = null,
    limit = 20
  ) {
    const reviewsRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .leftJoin("review_club_shares as rcs", "r.id", "rcs.review_id")
      .leftJoin("club_members as cm", function () {
        this.on("cm.club_id", "rcs.club_id").andOnVal(
          "cm.user_id",
          currentUserId
        );
      })
      .where("r.user_id", userId)
      .andWhere((qb) => {
        qb.where("r.private", false).orWhereNotNull("cm.user_id");
      })
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("r.id", "<", cursor);
        }
      })
      .groupBy("r.id", "u.id", "m.id")
      .select([
        ...reviewsColumnsToReturn,
        db.raw("array_remove(array_agg(rcs.club_id), null) as clubs"),
      ])
      .orderBy("r.id", "desc")
      .limit(limit);
    const reviews = transformReturnReviewData(reviewsRaw);
    return reviews;
  }

  async getMyReviews(userId, cursor = null, limit = 20) {
    const reviewsRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .where("r.user_id", userId)
      .select(reviewsColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("r.id", "<", cursor);
        }
      })
      .orderBy("r.id", "desc")
      .limit(limit);
    const reviews = transformReturnReviewData(reviewsRaw);
    return reviews;
  }

  async getReviewsByClubMedia(mediaId, clubId, cursor = null, limit = 20) {
    const reviewsRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .leftJoin("review_club_shares as rcs", "r.id", "rcs.review_id")
      .where("r.media_id", mediaId)
      .andWhere((qb) => {
        qb.where("r.private", false).orWhere("rcs.club_id", clubId);
      })
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("r.id", "<", cursor);
        }
      })
      .select(reviewsColumnsToReturn)
      .orderBy("r.id", "desc")
      .limit(limit);
    const reviews = transformReturnReviewData(reviewsRaw);
    return reviews;
  }

  async getAllReviews(cursor = null, limit = 30) {
    const reviewsRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .select(reviewsColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("r.id", "<", cursor);
        }
      })
      .orderBy("r.id", "desc")
      .limit(limit);
    const reviews = transformReturnReviewData(reviewsRaw);
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
    const reviewRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .select(reviewsColumnsToReturn)
      .where("r.id", id);
    const review = transformReturnReviewData(reviewRaw).reviews?.[0];
    return review;
  }

  async getReviewByAuthorAndMedia(userId, mediaId) {
    const reviewRaw = await db("reviews as r")
      .join("users as u", "r.user_id", "u.id")
      .join("media as m", "r.media_id", "m.id")
      .select(reviewsColumnsToReturn)
      .where("u.id", userId)
      .andWhere("m.id", mediaId);
    const review = transformReturnReviewData(reviewRaw).reviews?.[0];
    return review;
  }
}

export default new ReviewsDao();
