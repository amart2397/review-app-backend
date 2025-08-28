import express from "express";
import MediaSearchController from "../controller/mediaSearchController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  googleRateLimiter,
  TMDBRateLimiter,
} from "../middleware/rateLimiters.js";
const router = express.Router();

router.use(isAuthenticated);

router
  .route("/books")
  .get(googleRateLimiter, MediaSearchController.getBookQuery);
router
  .route("/books/:id")
  .get(googleRateLimiter, MediaSearchController.getBookById);

router
  .route("/movies")
  .get(TMDBRateLimiter, MediaSearchController.getMovieQuery);
router
  .route("/movies/:id")
  .get(TMDBRateLimiter, MediaSearchController.getMovieById);

export default router;
