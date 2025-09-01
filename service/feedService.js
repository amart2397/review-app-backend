import FeedDao from "../dao/feedDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";

class FeedService {
  async getUserFeed(
    currentUserId,
    cursors = {
      reviewsCursor: null,
      clubMediaCursor: null,
      clubThreadCursor: null,
    }
  ) {
    try {
      const feed = await FeedDao.getUserFeed(currentUserId, cursors);
      return feed;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new FeedService();
