import express from "express";
import MediaSearchController from "../controller/mediaSearchController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import {
  googleRateLimiter,
  TMDBRateLimiter,
} from "../middleware/rateLimiters.js";
const router = express.Router();

router
  .route("/books")
  .get(
    googleRateLimiter,
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaSearchController.getBookQuery
  );
router
  .route("/books/:id")
  .get(
    googleRateLimiter,
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaSearchController.getBookById
  );

router
  .route("/movies")
  .get(
    TMDBRateLimiter,
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaSearchController.getMovieQuery
  );
router
  .route("/movies/:id")
  .get(
    TMDBRateLimiter,
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaSearchController.getMovieById
  );

export default router;
