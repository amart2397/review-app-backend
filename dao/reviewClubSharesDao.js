import db from "../db/db.js";

class ReviewClubSharesDao {
  async getReviewClubShareById(shareId) {
    const share = await db("review_club_shares").first().where("id", shareId);
    return share;
  }

  async getReviewClubShareByClubAndReviewId(clubId, reviewId) {
    const share = await db("review_club_shares")
      .first()
      .where("review_id", reviewId)
      .andWhere("club_id", clubId);
    return share;
  }

  async addReviewClubShare(reviewId, clubId) {
    const [{ id }] = await db("review_club_shares")
      .insert({ review_id: reviewId, club_id: clubId })
      .returning("id");
    return id;
  }

  async deleteReviewClubShare(shareId) {
    const [{ id }] = await db("review_club_shares")
      .where("id", shareId)
      .returning("id")
      .del();
    return id;
  }
}

export default new ReviewClubSharesDao();
