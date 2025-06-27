import expressAsyncHandler from "express-async-handler";
import UsersValidator from "../validators/UsersValidator.js";
import UsersService from "../service/UsersService.js";
import AppError from "../utils/AppError.js";

class UsersController {
  // @desc Get all users
  // @route GET /users
  // @access Private
  getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await UsersService.getAllUsers();
    if (!users) {
      throw AppError.badRequest("No users found");
    }
    res.json(users);
  });

  // @desc create new user
  // @route POST /users
  // @access Private
  createUser = expressAsyncHandler(async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const inputUserData = {
      email,
      firstName,
      lastName,
      password,
    };
    const validatedData = UsersValidator.validateNewUserSchema(inputUserData);
    const newUserId = await UsersService.createUser(validatedData);
    res.status(201).json({
      message: `New user ${firstName} ${lastName} with id ${newUserId} created`,
    });
  });

  // @desc Update a user
  // @route PATCH /users
  // @access Private
  updateUser = expressAsyncHandler(async (req, res) => {});

  // @desc Delete a user
  // @route DELETE /users
  // @access Private
  deleteUser = expressAsyncHandler(async (req, res) => {});
}

export default new UsersController();
