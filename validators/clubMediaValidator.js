import * as z from "zod/v4";
import AppError from "../utils/AppError.js";
import compareSchema from "./helpers/compareSchema.js";
import MediaDao from "../dao/mediaDao.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ClubMediaDao from "../dao/clubMediaDao.js";
import ClubsDao from "../dao/clubsDao.js";

//Data schemas
const newClubMediaSchema = z
  .object({
    assignedBy: z.int(),
    mediaId: z.int().optional(),
    clubId: z.int(),
    media: z
      .object({
        mediaType: z.string(),
        mediaKey: z.string(),
        title: z.string(),
        description: z.string().optional(),
        releaseDate: z
          .string()
          .regex(/^\d{4}(-\d{2}-\d{2})?$/)
          .optional()
          .or(z.literal("")),
        artSmall: z.url().optional(),
        artLarge: z.url().optional(),
        genres: z.array(z.string()).optional(),
        runtime: z.number().optional(),
        authors: z.string().optional(),
        publisher: z.string().optional(),
        pageCount: z.number().optional(),
      })
      .optional(),
  })
  .refine((review) => review.mediaId != null || review.media != null, {
    message: "Must provide a media id or media object",
    path: ["media"],
  });

const deleteClubMediaSchema = z.object({
  id: z.int(),
  userId: z.int(),
  role: z.string(),
  clubId: z.int(),
});

class ClubMediaValidator {
  //schema validation (using zod)
  validateNewClubMediaSchema(inputClubMediaData) {
    return compareSchema(newClubMediaSchema, inputClubMediaData);
  }

  validateDeleteClubMediaSchema(inputClubMediaData) {
    return compareSchema(deleteClubMediaSchema, inputClubMediaData);
  }

  //app logic validation
  async validateNewClubMedia(inputClubMediaData) {
    const { assignedBy, mediaId, clubId } = inputClubMediaData;
    const media = await MediaDao.getMediaById(mediaId);
    const clubMediaCreator = await ClubMembersDao.getMemberByUserAndClub(
      assignedBy,
      clubId
    );
    const existingMedia = await ClubMediaDao.getClubMediaByClubAndMediaId(
      clubId,
      mediaId
    );
    const club = await ClubsDao.getClubById(clubId);
    if (!media) {
      throw AppError.badRequest("Media id does not exist");
    }
    if (!club) {
      throw AppError.badRequest("Club id does not exist");
    }
    if (!clubMediaCreator) {
      throw AppError.forbidden("You are not a member of this club");
    }
    if (clubMediaCreator?.memberRole === "member") {
      throw AppError.forbidden("You are not authorized to add club media");
    }
    if (existingMedia) {
      throw AppError.conflict("Club media already exists for this club");
    }
    if (media.media_type !== club.mediaType) {
      throw AppError.badRequest("Media type must match club type");
    }
    return inputClubMediaData;
  }

  async validateDeleteClubMedia(inputClubMediaData) {
    const { id, userId, clubId, role } = inputClubMediaData;
    const media = await ClubMediaDao.getClubMediaById(id);
    const requestedBy = await ClubMembersDao.getMemberByUserAndClub(
      userId,
      clubId
    );
    if (!media) {
      throw AppError.badRequest("Club media does not exist");
    }
    if (media.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id and club id pair");
    }
    if (role !== "admin") {
      if (!requestedBy || requestedBy?.memberRole === "member") {
        throw AppError.forbidden("You are not authorized to delete club media");
      }
    }
    return inputClubMediaData;
  }

  async validateClubMediaAndClub(clubMediaId, clubId) {
    const clubMedia = await ClubMediaDao.getClubMediaById(clubMediaId);
    if (clubMedia.clubId !== clubId) {
      throw AppError.badRequest("Invalid club media id and club id pair");
    }
  }
} //cleaned

export default new ClubMediaValidator();
