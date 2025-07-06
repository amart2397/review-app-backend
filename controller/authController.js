import expressAsyncHandler from "express-async-handler";
import UsersService from "../service/usersService.js";
import UsersValidator from "../validators/usersValidator.js";
import passport from "passport";
import { generateToken } from "../config/csrfSync.js";

class AuthController {
  // @desc create new user
  // @route POST /auth/register
  // @access Public
  registerUser = expressAsyncHandler(async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const inputUserData = {
      email,
      firstName,
      lastName,
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
}

export default new AuthController();
