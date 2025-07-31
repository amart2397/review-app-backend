import expressAsyncHandler from "express-async-handler";
import UsersService from "../service/usersService.js";
import UsersValidator from "../validators/usersValidator.js";
import passport from "passport";
import { generateToken } from "../config/csrfSync.js";
import AppError from "../utils/AppError.js";

class AuthController {
  // @desc create new user
  // @route POST /auth/register
  // @access Public
  registerUser = expressAsyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
      throw AppError.badRequest("Already logged in");
    }
    const { email, firstName, lastName, password } = req.body;
    const displayName =
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1).toLowerCase() +
      " " +
      lastName.charAt(0).toUpperCase() +
      ".";
    const inputUserData = {
      email,
      firstName,
      lastName,
      displayName,
      password,
    };
    const validatedData = UsersValidator.validateNewUserSchema(inputUserData);
    const newUserId = await UsersService.createUser(validatedData);
    const newUser = {
      id: newUserId,
    };
    req.login(newUser, (err) => {
      if (err) return next(err);
      res.status(201).json({
        message: `New user ${firstName} ${lastName} with id ${newUserId} created`,
      });
    });
  });

  // @desc login user
  // @route POST /auth/login
  // @access Public
  loginUser = (req, res, next) => {
    if (req.isAuthenticated()) {
      throw AppError.badRequest("Already logged in");
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .json({ message: info.message || "login failed" });

      req.login(user, (err) => {
        if (err) return next(err);
        res.json({
          message: `Logged in successfully`,
          userId: user.id,
        });
      });
    })(req, res, next);
  };

  // @desc logout user
  // @route POST /auth/logout
  // @access Private
  logoutUser = (req, res, next) => {
    if (!req.isAuthenticated()) {
      throw AppError.badRequest("Not logged in");
    }
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.clearCookie("r8r.sid");
        res.json({ message: "Logged out successfully" });
      });
    });
  };

  // @desc get csrf token for req session
  // @route GET /auth/csrf-token
  // @access Private
  getCsrfToken = (req, res, next) => {
    res.json({ token: generateToken(req) });
  };

  // @desc get basic user info for req session
  // @route GET /auth/me
  // @access Private
  getMe = expressAsyncHandler((req, res, next) => {
    const { id, first_name, last_name, role } = req?.user;
    const user = {
      id,
      firstName: first_name,
      lastName: last_name,
      role,
    };
    res.json(user);
  });
}

export default new AuthController();
