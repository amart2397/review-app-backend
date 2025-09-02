import ClubsDao from "../dao/clubsDao.js";
import MediaDao from "../dao/mediaDao.js";
import PostPermissionRequestsDao from "../dao/postPermissionRequestsDao.js";
import ReviewsDao from "../dao/reviewsDao.js";
import UsersDao from "../dao/usersDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";

class AdminService {
  //POST PERMISSIONS REQUESTS
  async getPendingRequests(cursor = null) {
    try {
      const requests = await PostPermissionRequestsDao.getPendingRequests(
        cursor
      );
      return requests;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getProcessedRequests(cursor = null) {
    try {
      const requests = await PostPermissionRequestsDao.getProcessedRequests(
        cursor
      );
      return requests;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async respondToRequest(requestId, accepted, reviewerId) {
    try {
      if (typeof accepted !== "boolean") {
        throw new AppError.badRequest("accepted must be a boolean");
      }
      const request = await PostPermissionRequestsDao.getRequestById(requestId);
      const userId = request.userId;
      if (accepted) {
        await UsersDao.updateUser({ id: userId, role: "poster" });
        await PostPermissionRequestsDao.updateRequest(
          requestId,
          reviewerId,
          "approved"
        );
      } else {
        await PostPermissionRequestsDao.updateRequest(
          requestId,
          reviewerId,
          "denied"
        );
      }
      return;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteRequest(requestId) {
    try {
      const delId = await PostPermissionRequestsDao.deleteRequest(requestId);
      return delId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //USERS
  async getAllUsers(cursor = null) {
    try {
      const users = await UsersDao.getAllUsersForAdmin(cursor);
      return users;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteUser(id) {
    try {
      const delUser = await UsersDao.deleteUser({ id });
      if (!delUser) {
        throw AppError.badRequest(`User with id ${id} not found`);
      }
      return delUser;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateUserRole(id, role) {
    try {
      if (!role || (role !== "user" && role !== "poster" && role !== "admin")) {
        throw AppError.badRequest(`Invalid role input`);
      }
      const user = await UsersDao.getUserById(id);
      if (!user) {
        throw AppError.badRequest(`User with id ${id} not found`);
      }
      await UsersDao.updateUser({ id, role });
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //MEDIA
  async getAllMedia(cursor = null) {
    try {
      const media = await MediaDao.getAllMedia(cursor);
      return media;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteMedia(id) {
    try {
      const delMedia = await MediaDao.deleteMedia({ id });
      if (!delMedia) {
        throw AppError.badRequest(`Media with id ${id} not found`);
      }
      return delMedia;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //REVIEWS
  async getAllReviews(cursor = null) {
    try {
      const reviews = await ReviewsDao.getAllReviews(cursor);
      return reviews;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteReview(id) {
    try {
      const delReview = await ReviewsDao.deleteReview({ id });
      if (!delReview) {
        throw AppError.badRequest(`Review with id ${id} not found`);
      }
      return delReview;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //CLUBS
  async getAllClubs(cursor = null) {
    try {
      const clubs = await ClubsDao.getAllClubs(cursor);
      return clubs;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClub(id) {
    try {
      const delClub = await ClubsDao.deleteClub({ id });
      if (!delClub) {
        throw AppError.badRequest(`Club with id ${id} not found`);
      }
      return delClub;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new AdminService();
