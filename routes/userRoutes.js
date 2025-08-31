import express from "express";
import UsersController from "../controller/usersController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, UsersController.getAllUsers)
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    UsersController.createUser
  );

router
  .route("/:id")
  .get(UsersController.getUser)
  .patch(
    isAuthenticated,
    csrfSynchronisedProtection,
    UsersController.updateUser
  )
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    UsersController.deleteUser
  );

router
  .route("/:id/reviews")
  .get(
    isAuthenticated,
    csrfSynchronisedProtection,
    UsersController.getReviewsByUser
  );

export default router;
