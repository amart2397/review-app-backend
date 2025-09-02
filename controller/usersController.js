import expressAsyncHandler from "express-async-handler";
import UsersValidator from "../validators/usersValidator.js";
import UsersService from "../service/usersService.js";
import AppError from "../utils/AppError.js";
import ReviewsService from "../service/reviewsService.js";

class UsersController {
  // @desc get all users
  // @route GET /users?cursor
  // @access Private
  getAllUsers = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const users = await UsersService.getAllUsers(cursor);
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

  // @desc get specific user
  // @route GET /users/:id
  // @access Private
  getUser = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const inputData = { id };
    const validatedId = UsersValidator.validateUserIdSchema(inputData);
    const user = await UsersService.getUserById(validatedId);
    if (!user) {
      throw AppError.badRequest("User not found");
    }
    res.json(user);
  });

  // @desc update a user
  // @route PATCH /users/:id
  // @access Private
  updateUser = expressAsyncHandler(async (req, res) => {
    const {
      id: id_body,
      email,
      firstName,
      lastName,
      password,
      role,
    } = req.body;
    const id = parseInt(req.params.id);
    const requestUserId = req.user.id;
    if (id_body && id !== id_body) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputUserData = {
      id,
      email,
      firstName,
      lastName,
    };
    if (password) {
      inputUserData.password = password;
    }
    if (role) {
      inputUserData.role = role;
    }
    const validatedData =
      UsersValidator.validateUpdateUserSchema(inputUserData);
    await UsersService.updateUser(validatedData, requestUserId);
    res.json({
      message: `User ${firstName} ${lastName} updated`,
    });
  });

  // @desc delete a user
  // @route DELETE /users/:id
  // @access Private
  deleteUser = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { id: id_body } = req.body;
    const requestUserId = req.user.id;
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputUserData = { id };
    const validatedData = UsersValidator.validateUserIdSchema(inputUserData);
    const { email } = await UsersService.deleteUser(
      validatedData,
      requestUserId
    );
    res.json({
      message: `User ${email} with id ${id} was deleted`,
    });
  });

  // @desc get reviews for a given user
  // @route GET /users/:id/reviews?cursor
  // @access Private
  getReviewsByUser = expressAsyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const currentUserId = parseInt(req.user.id);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const reviews = await ReviewsService.getReviewsByUser(
      currentUserId,
      userId,
      cursor
    );
    res.json(reviews);
  });
}

export default new UsersController();
