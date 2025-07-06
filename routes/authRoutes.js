import express from "express";
import AuthController from "../controller/authController.js";
const router = express.Router();

router.route("/register").post(AuthController.registerUser);
router.route("/login").post(AuthController.loginUser);
router.route("/logout").post(AuthController.logoutUser);

export default router;
