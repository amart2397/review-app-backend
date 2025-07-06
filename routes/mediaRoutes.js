import express from "express";
import MediaController from "../controller/mediaController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router
  .route("/")
  .get(MediaController.getAllMedia)
  .post(
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaController.createMedia
  );

router
  .route("/:id")
  .get(MediaController.getMedia)
  .patch(
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaController.updateMedia
  )
  .delete(
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaController.deleteMedia
  );

export default router;
