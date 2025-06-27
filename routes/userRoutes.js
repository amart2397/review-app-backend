import express from "express";
import UsersController from "../controller/UsersController.js";
const router = express.Router();

router
  .route("/")
  .get(UsersController.getAllUsers)
  .post(UsersController.createUser)
  .patch(UsersController.updateUser)
  .delete(UsersController.deleteUser);

export default router;
