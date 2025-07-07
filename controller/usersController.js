import expressAsyncHandler from "express-async-handler";
import UsersValidator from "../validators/usersValidator.js";
import UsersService from "../service/usersService.js";
import AppError from "../utils/AppError.js";

//NOTES:
//This class is structured differently than the other service, dao, and validator classes.
//Arrow functions might be useful in other classes (since I am exporting single instances of the classes), but it makes it harder to mock for testing
class UsersController {
  // @desc Get all users
  // @route GET /users
  // @access Private
  getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await UsersService.getAllUsers();
    if (users.length === 0) {
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

  // @desc Get specific user
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

  // @desc Update a user
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

  // @desc Delete a user
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
}

export default new UsersController();
