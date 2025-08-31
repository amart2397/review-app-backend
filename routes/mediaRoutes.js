import express from "express";
import MediaController from "../controller/mediaController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import hasPostPermissions from "../middleware/hasPostPermissions.js";
const router = express.Router();

//Post permission check on non-GET routes
router.use((req, res, next) => {
  if (["POST", "PATCH", "DELETE"].includes(req.method)) {
    return hasPostPermissions(req, res, next);
  }
  next();
});

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

router
  .route("/:id/reviews")
  .get(
    isAuthenticated,
    csrfSynchronisedProtection,
    MediaController.getReviewsByMedia
  );
export default router;
