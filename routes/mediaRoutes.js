import express from "express";
import MediaController from "../controller/mediaController.js";
const router = express.Router();

router
  .route("/")
  .get(MediaController.getAllMedia)
  .post(MediaController.createMedia);

router
  .route("/:id")
  .get(MediaController.getMedia)
  .patch(MediaController.updateMedia)
  .delete(MediaController.deleteMedia);

export default router;
