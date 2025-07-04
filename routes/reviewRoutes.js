import express from "express";
import ReviewsController from "../controller/reviewsController.js";
const router = express.Router();

router
  .route("/")
  .get(ReviewsController.getAllReviews)
  .post(ReviewsController.createReview);

router
  .route("/:id")
  .get(ReviewsController.getReview)
  .patch(ReviewsController.updateReview)
  .delete(ReviewsController.deleteReview);

export default router;
