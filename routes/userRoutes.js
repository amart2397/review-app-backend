import express from "express";
import UsersController from "../controller/UsersController.js";
const router = express.Router();

router
  .route("/")
  .get(UsersController.getAllUsers)
  .post(UsersController.createUser);

router
  .route("/:id")
  .get(UsersController.getUser)
  .patch(UsersController.updateUser)
  .delete(UsersController.deleteUser);

export default router;
