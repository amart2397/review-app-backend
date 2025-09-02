import PostPermissionRequestsDao from "../dao/postPermissionRequestsDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import PostPermissionReqValidator from "../validators/postPermissionReqValidator.js";

class PostPermissionRequestsService {
  async addPostPermRequest(userId) {
    try {
      await PostPermissionReqValidator.validateNewRequest(userId);
      const newId = await PostPermissionRequestsDao.addRequest(userId);
      return newId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getPostPermRequestByUser(userId) {
    try {
      const request = await PostPermissionRequestsDao.getRequestByUser(userId);
      return request;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new PostPermissionRequestsService();
