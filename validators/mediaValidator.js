import * as z from "zod/v4";
import MediaDao from "../dao/mediaDao.js";
import AppError from "../utils/AppError.js";
import compareSchema from "./helpers/compareSchema.js";

//Data schemas
const newMediaSchema = z.object({
  mediaType: z.enum(["book", "movie"]),
  mediaKey: z.string(),
  title: z.string(),
  description: z.string().optional(),
  releaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  imgSmall: z.url().optional(),
  imgLarge: z.url().optional(),
  genres: z.array(z.string()).optional(),
  runtime: z.number().optional(),
  authors: z.string().optional(),
  publisher: z.string().optional(),
  pageCount: z.number().optional(),
});

const updateMediaSchema = z.object({
  id: z.int(),
  mediaType: z.enum(["book", "movie"]),
  mediaKey: z.string(),
  title: z.string(),
  description: z.string().optional(),
  releaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  imgSmall: z.url().optional(),
  imgLarge: z.url().optional(),
  genres: z.array(z.string()).optional(),
  runtime: z.number().optional(),
  authors: z.string().optional(),
  publisher: z.string().optional(),
  pageCount: z.number().optional(),
});

const mediaIdSchema = z.object({
  id: z.int(),
});

class MediaValidator {
  //schema validation (using zod)
  validateNewMediaSchema(inputMediaData) {
    return compareSchema(newMediaSchema, inputMediaData, true);
  }

  validateMediaIdSchema(inputMediaData) {
    return compareSchema(mediaIdSchema, inputMediaData, true);
  }

  validateUpdateMediaSchema(inputMediaData) {
    return compareSchema(updateMediaSchema, inputMediaData, true);
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
