import express from "express";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import MeController from "../controller/meController.js";
const router = express.Router();

router.use(isAuthenticated, csrfSynchronisedProtection);

router.route("/").get(MeController.getMe);

router.route("/clubs").get(MeController.getMyClubs);

router.route("/clubs/invites").get(MeController.getMyInvites);

router
  .route("/clubs/:clubId/invites/:inviteId")
  .post(MeController.respondToInvite);

router
  .route("/clubs/:clubId/member")
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    MeController.removeFromClub
  );

export default router;
