import expressAsyncHandler from "express-async-handler";
import MediaService from "../service/mediaService.js";
import MediaValidator from "../validators/mediaValidator.js";
import AppError from "../utils/AppError.js";

class MediaController {
  // @desc Get all media
  // @route GET /media
  // @access Private
  getAllMedia = expressAsyncHandler(async (req, res) => {
    const media = await MediaService.getAllMedia();
    if (media.length === 0) {
      throw AppError.badRequest("No media found");
    }
    res.json(media);
  });

  // @desc create new media entry
  // @route POST /media
  // @access Private
  createMedia = expressAsyncHandler(async (req, res) => {
    const {
      mediaType,
      mediaKey,
      title,
      description,
      releaseDate,
      imgSmall,
      imgLarge,
      genres,
      runtime,
      authors,
      publisher,
      pageCount,
    } = req.body;
    const inputMediaData = {
      mediaType,
      mediaKey,
      title,
      description,
      releaseDate,
      imgSmall,
      imgLarge,
      genres,
      runtime,
      authors,
      publisher,
      pageCount,
    };
    const validatedData = MediaValidator.validateNewMediaSchema(inputMediaData);
    const newMediaId = await MediaService.createMedia(validatedData);
    res.status(201).json({
      message: `New media ${title} with id ${newMediaId} created`,
    });
  });

  // @desc Get specific media entry
  // @route GET /media/:id
  // @access Private
  getMedia = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const inputData = { id };
    const validatedId = MediaValidator.validateMediaIdSchema(inputData);
    const media = await MediaService.getMediaById(validatedId);
    if (media.length === 0) {
      throw AppError.badRequest("Media not found");
    }
    res.json(media);
  });

  // @desc Update a media entry
  // @route PATCH /media/:id
  // @access Private
  updateMedia = expressAsyncHandler(async (req, res) => {
    const {
      id: id_body,
      mediaType,
      mediaKey,
      title,
      description,
      releaseDate,
      imgSmall,
      imgLarge,
      genres,
      runtime,
      authors,
      publisher,
      pageCount,
    } = req.body;
    const id = parseInt(req.params.id);
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputMediaData = {
      id,
      mediaType,
      mediaKey,
      title,
      description,
      releaseDate,
      imgSmall,
      imgLarge,
      genres,
      runtime,
      authors,
      publisher,
      pageCount,
    };
    const validatedData =
      MediaValidator.validateUpdateMediaSchema(inputMediaData);
    await MediaService.updateMedia(validatedData);
    res.json({
      message: `Media ${title} updated`,
    });
  });

  // @desc Delete a media entry
  // @route DELETE /media/:id
  // @access Private
  deleteMedia = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { id: id_body } = req.body;
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputMediaData = { id };
    const validatedData = MediaValidator.validateMediaIdSchema(inputMediaData);
    const { title } = await MediaService.deleteMedia(validatedData);
    res.json({
      message: `Media entry: ${title} with id ${id} was deleted`,
    });
  });
}

export default new MediaController();
