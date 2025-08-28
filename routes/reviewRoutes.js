import express from "express";
import ReviewsController from "../controller/reviewsController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import hasPostPermissions from "../middleware/hasPostPermissions.js";
const router = express.Router();

//Post permission check on non-GET routes
router.use((req, res, next) => {
  if (["POST", "PATCH", "DELETE"].includes(req.method)) {
    return hasPostPermissions(req, res, next);
  }
  next();
});

router
  .route("/")
  .get(ReviewsController.getPublicReviews)
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
