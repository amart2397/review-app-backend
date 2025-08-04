import express from "express";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import MeController from "../controller/meController.js";
const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  csrfSynchronisedProtection,
  MeController.getMe
);

export default router;
