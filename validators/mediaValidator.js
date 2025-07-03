import * as z from "zod/v4";
import MediaDao from "../dao/mediaDao.js";
import AppError from "../utils/AppError.js";
import compareSchema from "./helpers/compareSchema.js";

//Data schemas
const newMediachema = z.object({
  mediaType: z.string(),
  mediaKey: z.string(),
  mediaTitle: z.string(),
  mediaDescription: z.string(),
  mediaArt: z.string(),
});

const updateMediachema = z.object({
  id: z.int(),
  mediaType: z.string(),
  mediaKey: z.string(),
  mediaTitle: z.string(),
  mediaDescription: z.string(),
  mediaArt: z.string(),
});

const mediaIdSchema = z.object({
  id: z.int(),
});

class MediaValidator {
  //schema validation (using zod)
  validateNewMediachema(inputMediaData) {
    return compareSchema(newMediachema, inputMediaData);
  }

  validateMediaIdSchema(inputMediaData) {
    return compareSchema(mediaIdSchema, inputMediaData);
  }

  validateUpdateMediachema(inputMediaData) {
    return compareSchema(updateMediachema, inputMediaData);
  }

  //app logic validation
  async validateNewMedia(inputMediaData) {
    const { mediaType, mediaKey } = inputMediaData;
    const existingMedia = await MediaDao.getMediaByKeyAndType(
      mediaKey,
      mediaType
    );
    if (existingMedia) {
      throw AppError.conflict("Media already exists");
    }
    return inputMediaData;
  }

  async validateUpdateMedia(inputMediaData) {
    const { id, mediaType, mediaKey } = inputMediaData;
    const existingMedia = await MediaDao.getMediaByKeyAndType(
      mediaKey,
      mediaType
    );
    if (existingMedia && existingMedia?.id !== id) {
      throw AppError.conflict("Media already exists");
    }
    const existingMediaById = await MediaDao.getMediaById(id);
    if (!existingMediaById) {
      throw AppError.badRequest("Media not found");
    }
    return inputMediaData;
  }

  async validateDeleteMedia(inputMediaData) {
    const { id } = inputMediaData;
    const existingMedia = await MediaDao.getMediaById(id);
    if (!existingMedia) {
      throw AppError.badRequest("Media not found");
    }
    return inputMediaData;
  }
}

export default new MediaValidator();
