import express from "express";
import MediaSearchController from "../controller/mediaSearchController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
const router = express.Router();

router
  .route("/books")
  .get(
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaSearchController.getBookQuery
  );

router.route("/movies").get(isAuthenticated, csrfSynchronisedProtection);

export default router;
