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

router
  .route("/:clubId/invites/:inviteId")
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.deleteClubInvite
  );

router
  .route("/:clubId/members")
  .get(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.getClubMembers
  )
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.addClubMember
  );

router
  .route("/:clubId/members/:memberId")
  .patch(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.updateClubMemberRole
  )
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.deleteClubMember
  );

export default router;
