import PostPermissionRequestsDao from "../dao/postPermissionRequestsDao.js";
import UsersDao from "../dao/usersDao.js";
import AppError from "../utils/AppError.js";

class PostPermissionReqValidator {
  async validateNewRequest(userId) {
    const user = await UsersDao.getUserById(userId);
    const existingRequest = await PostPermissionRequestsDao.getRequestByUser(
      userId
    );
    if (!user) {
      throw AppError.badRequest("User id does not exist");
    }
    if (user.role !== "user") {
      throw AppError.badRequest("User already has post permissions");
    }
    if (existingRequest) {
      throw AppError.conflict("User has already requested post permissions");
    }
  }
}

export default new PostPermissionReqValidator();
