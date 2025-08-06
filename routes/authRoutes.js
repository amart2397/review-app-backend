import express from "express";
import AuthController from "../controller/authController.js";
import { csrfSynchronisedProtection } from "../config/csrfSync.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post(
  "/logout",
  isAuthenticated,
  csrfSynchronisedProtection,
  AuthController.logoutUser
);
router.get("/csrf-token", isAuthenticated, AuthController.getCsrfToken);

export default router;
