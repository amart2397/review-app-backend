import express from "express";
import UsersController from "../controller/usersController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router.use(isAuthenticated, csrfSynchronisedProtection);
router
  .route("/")
  .get(UsersController.getAllUsers)
  .post(UsersController.createUser);

router
  .route("/:id")
  .get(UsersController.getUser)
  .patch(UsersController.updateUser)
  .delete(UsersController.deleteUser);

router.route("/:id/reviews").get(UsersController.getReviewsByUser);

router.route("/:id/reviews/pinned").get(UsersController.getPinnedReview);

export default router;
