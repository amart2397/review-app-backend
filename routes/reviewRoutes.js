import express from "express";
import ReviewsController from "../controller/reviewsController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router
  .route("/")
  .get(ReviewsController.getAllReviews)
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    ReviewsController.createReview
  );

router
  .route("/:id")
  .get(ReviewsController.getReview)
  .patch(
    isAuthenticated,
    csrfSynchronisedProtection,
    ReviewsController.updateReview
  )
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    ReviewsController.deleteReview
  );

export default router;
