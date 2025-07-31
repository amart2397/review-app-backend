import express from "express";
import ClubsController from "../controller/clubsController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router
  .route("/")
  .get(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.getAllPublicClubs
  )
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.createClub
  );

export default router;
