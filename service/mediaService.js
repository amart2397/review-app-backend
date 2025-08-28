import MediaDao from "../dao/mediaDao.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import MediaValidator from "../validators/mediaValidator.js";

class MediaService {
  async getAllMedia(cursor = null) {
    try {
      const media = await MediaDao.getAllMedia(cursor);
      return media;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async createMedia(inputMediaData) {
    try {
      const validatedData = await MediaValidator.validateNewMedia(
        inputMediaData
      );
      const newMediaId = await MediaDao.createMedia(validatedData);
      return newMediaId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateMedia(inputMediaData) {
    try {
      const validatedData = await MediaValidator.validateUpdateMedia(
        inputMediaData
      );
      await MediaDao.updateMedia(validatedData);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteMedia(inputMediaData) {
    try {
      const validatedData = await MediaValidator.validateDeleteMedia(
        inputMediaData
      );
      const delMedia = await MediaDao.deleteMedia(validatedData);
      return delMedia;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getMediaById(inputMediaData) {
    try {
      const { id } = inputMediaData;
      const media = await MediaDao.getMediaById(id);
      return media;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new MediaService();
