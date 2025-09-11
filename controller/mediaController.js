import expressAsyncHandler from "express-async-handler";
import MediaService from "../service/mediaService.js";
import MediaValidator from "../validators/mediaValidator.js";
import AppError from "../utils/AppError.js";
import ReviewsService from "../service/reviewsService.js";

class MediaController {
  // @desc get all media
  // @route GET /media?cursor=title#IDname=?
  // @access Public
  getAllMedia = expressAsyncHandler(async (req, res) => {
    const cursorRaw = req.query.cursor ? parseInt(req.query.cursor) : null;
    const name = req.query.name ? req.query.name.trim() : null;
    let cursor = null;
    if (cursorRaw) {
      const [title, id] = cursorRaw.split("#"); //cursor expected to be title#ID
      cursor = { title, id: parseInt(id, 10) };
    }
    const media = await MediaService.getAllMedia(cursor, name);
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
      mediaKey: String(mediaKey),
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

  // @desc get specific media entry
  // @route GET /media/:id
  // @access Private
  getMedia = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const media = await MediaService.getMediaById({ id });
    if (media.length === 0) {
      throw AppError.badRequest("Media not found");
    }
    res.json(media);
  });

  // @desc update a media entry
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

  // @desc delete a media entry
  // @route DELETE /media/:id
  // @access Private
  deleteMedia = expressAsyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { id: id_body } = req.body;
    if (id_body && id_body !== id) {
      throw AppError.badRequest("ID in request body does not match ID in URL");
    }
    const inputMediaData = { id };
    const validatedData =
      MediaValidator.validateDeleteMediaSchema(inputMediaData);
    const { title } = await MediaService.deleteMedia(validatedData);
    res.json({
      message: `Media entry: ${title} with id ${id} was deleted`,
    });
  });

  // @desc get reviews for a given media
  // @route GET /media/:id/reviews?cursor
  // @access Public
  getReviewsByMedia = expressAsyncHandler(async (req, res) => {
    const mediaId = parseInt(req.params.id);
    const currentUserId = req.user?.id ? parseInt(req.user.id) : null;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const reviews = await ReviewsService.getReviewsByMedia(
      currentUserId,
      mediaId,
      cursor
    );
    res.json(reviews);
  });
}

export default new MediaController();
