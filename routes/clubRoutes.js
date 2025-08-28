import express from "express";
import ClubsController from "../controller/clubsController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import hasPostPermissions from "../middleware/hasPostPermissions.js";
const router = express.Router();

//clubs
router
  .route("/")
  .get(ClubsController.getAllPublicClubs)
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    ClubsController.createClub
  );

//Auth check
router.use(isAuthenticated, csrfSynchronisedProtection);

//Post permission check on non-GET routes
router.use((req, res, next) => {
  if (["POST", "PATCH", "DELETE"].includes(req.method)) {
    return hasPostPermissions(req, res, next);
  }
  next();
});

router
  .route("/:clubId")
  .patch(ClubsController.updateClub)
  .delete(ClubsController.deleteClub);

//invites
router
  .route("/:clubId/invites")
  .get(ClubsController.getClubInvites)
  .post(ClubsController.createClubInvite);

router
  .route("/:clubId/invites/:inviteId")
  .delete(ClubsController.deleteClubInvite);

//members
router
  .route("/:clubId/members")
  .get(ClubsController.getClubMembers)
  .post(ClubsController.addClubMember);

router
  .route("/:clubId/members/:memberId")
  .patch(ClubsController.updateClubMemberRole)
  .delete(ClubsController.deleteClubMember);

//club media
router
  .route("/:clubId/media")
  .get(ClubsController.getClubMedia)
  .post(ClubsController.addClubMedia);

router
  .route("/:clubId/media/:clubMediaId")
  .delete(ClubsController.deleteClubMedia);

//threads
router
  .route("/:clubId/media/:clubMediaId/threads")
  .get(ClubsController.getClubThreads)
  .post(ClubsController.addClubThread);

router
  .route("/:clubId/media/:clubMediaId/threads/:threadId")
  .patch(ClubsController.updateThreadTitle)
  .delete(ClubsController.deleteClubThread);

//thread comments
router
  .route("/:clubId/media/:clubMediaId/threads/:threadId/comments")
  .get(ClubsController.getClubThreadComments)
  .post(ClubsController.addClubThreadComment);

router
  .route(
    "/:clubId/media/:clubMediaId/threads/:threadId/comments/:commentId/replies"
  )
  .get(ClubsController.getCommentReplies);

router
  .route("/:clubId/media/:clubMediaId/threads/:threadId/comments/:commentId")
  .patch(ClubsController.updateClubThreadComment)
  .delete(ClubsController.deleteClubThreadComment);

//review club shares
router
  .route("/:clubId/media/:clubMediaId/reviews/:reviewId/share")
  .post(ClubsController.shareReview);

router
  .route("/:clubId/media/:clubMediaId/reviews/:reviewId/share/:shareId")
  .delete(ClubsController.removeReviewShare);

export default router;
