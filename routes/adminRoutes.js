import express from "express";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import AdminController from "../controller/adminController.js";
const router = express.Router();

router.use(isAuthenticated, csrfSynchronisedProtection, isAdmin);

router.route("/users").get(AdminController.getAllUsers);
router
  .route("/users/:userId")
  .patch(AdminController.updateUserRole)
  .delete(AdminController.deleteUser);

router.route("/media").get(AdminController.getAllMedia);
router.route("/media/:mediaId").delete(AdminController.deleteMedia);

router.route("/reviews").get(AdminController.getAllReviews);
router.route("/reviews/:reviewId").delete(AdminController.deleteReview);

router.route("/clubs").get(AdminController.getAllClubs);
router.route("/clubs/:clubId").delete(AdminController.deleteClub);

router.route("/permissions/pending").get(AdminController.getPendingRequests);
router
  .route("/permissions/processed")
  .get(AdminController.getProcessedRequests);
router
  .route("/permissions/:id")
  .post(AdminController.respondToRequest)
  .delete(AdminController.deleteRequest);

export default router;
