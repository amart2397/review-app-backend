import express from "express";
import ClubsController from "../controller/clubsController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router
  .route("/")
  .get(ClubsController.getAllPublicClubs)
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.createClub
  );

router
  .route("/:clubId")
  .patch(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.updateClub
  )
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.deleteClub
  );

router
  .route("/:clubId/invites")
  .get(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.getClubInvites
  )
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.createClubInvite
  );

export default router;
