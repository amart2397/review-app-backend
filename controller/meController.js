import expressAsyncHandler from "express-async-handler";
import AppError from "../utils/AppError";

class MeController {
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

export default new MeController();
