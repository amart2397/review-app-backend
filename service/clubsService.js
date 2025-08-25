import env from "dotenv";
import ClubsDao from "../dao/clubsDao.js";
import ClubsValidator from "../validators/clubsValidator.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import ClubInviteValidator from "../validators/clubInviteValidator.js";
import ClubInvitesDao from "../dao/clubInvitesDao.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";
import ClubMediaDao from "../dao/clubMediaDao.js";
import ClubMediaValidator from "../validators/clubMediaValidator.js";
import MediaDao from "../dao/mediaDao.js";
import MediaValidator from "../validators/mediaValidator.js";
import ClubThreadsDao from "../dao/clubThreadsDao.js";
import ClubThreadsValidator from "../validators/clubThreadsValidator.js";
import ClubThreadCommentsDao from "../dao/clubThreadCommentsDao.js";
import ClubThreadCommentValidator from "../validators/clubThreadCommentValidator.js";
env.config();

class ClubsService {
  //Clubs
  async getPublicClubs() {
    try {
      const clubs = await ClubsDao.getPublicClubs();
      return clubs;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async createClub(inputClubData) {
    try {
      const validatedData = await ClubsValidator.validateNewClub(inputClubData);
      const newClubId = await ClubsDao.createClub(validatedData);
      await ClubMembersDao.createMember({
        clubId: newClubId,
        userId: validatedData.creatorId,
        role: "creator",
      });
      return newClubId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateClub(inputClubData) {
    try {
      const validatedData = await ClubsValidator.validateUpdateClub(
        inputClubData
      );
      await ClubsDao.updateClub(validatedData);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClub(inputClubData) {
    try {
      const validatedData = await ClubsValidator.validateDeleteClub(
        inputClubData
      );
      const delClub = await ClubsDao.deleteClub(validatedData);
      return delClub;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getUserClubs(userId) {
    try {
      const clubs = await ClubMembersDao.getClubsForUser(userId);
      return clubs;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //Club Invites
  async createClubInvite(inputInviteData) {
    try {
      const validatedData = await ClubInviteValidator.validateNewClubInvite(
        inputInviteData
      );
      const newId = await ClubInvitesDao.createInvite(validatedData);
      return newId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClubInvite(inputInviteData) {
    try {
      const validatedData = await ClubInviteValidator.validateDeleteClubInvite(
        inputInviteData
      );
      const delId = await ClubInvitesDao.deleteInvite(validatedData.id);
      return delId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getClubInvites(userId, clubId) {
    try {
      await ClubMembersValidator.validateUserIsClubMember(userId, clubId);
      const invites = await ClubInvitesDao.getClubInvites(clubId);
      return invites;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getUserInvites(userId) {
    try {
      const invites = await ClubInvitesDao.getUserInvites(userId);
      return invites;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async respondToInvite({ inputInviteData, inputClubMemberData, accepted }) {
    try {
      const validatedInvite =
        await ClubInviteValidator.validateDeleteClubInvite(inputInviteData);
      const validatedMember = await ClubMembersValidator.validateNewClubMember(
        inputClubMemberData
      );
      let returnId;
      if (accepted) {
        returnId = await ClubMembersDao.createMember(validatedMember);
      }
      const delId = await ClubInvitesDao.deleteInvite(validatedInvite.id);
      return accepted ? returnId : delId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //Club Members
  async getClubMembers(userId, clubId) {
    try {
      await ClubMembersValidator.validateUserIsClubMember(userId, clubId);
      const members = await ClubMembersDao.getClubMembers(clubId);
      return members;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async addClubMember(inputClubMemberData) {
    try {
      const { userId, clubId } = inputClubMemberData;
      const validatedData = await ClubMembersValidator.validateNewClubMember(
        inputClubMemberData
      );
      const invite = await ClubInvitesDao.getInviteByUserAndClub(
        userId,
        clubId
      );
      if (invite) {
        await ClubInvitesDao.deleteInvite(invite.invites[0].id); //Delete current invite if it exists
      }
      const newId = await ClubMembersDao.createMember(validatedData);
      return newId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateClubMember(inputClubMemberData) {
    try {
      const validatedData = await ClubMembersValidator.validateUpdateClubMember(
        inputClubMemberData
      );
      await ClubMembersDao.updateMemberRole(
        validatedData.id,
        validatedData.role
      );
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async removeClubMember(inputClubData) {
    try {
      const validatedData = await ClubMembersValidator.validateDeleteClubMember(
        inputClubData
      );
      const id = await ClubMembersDao.deleteMember(validatedData.id);
      return id;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //Club Media
  async getClubMedia(userId, clubId) {
    try {
      await ClubMembersValidator.validateUserIsClubMember(userId, clubId);
      const clubMedia = await ClubMediaDao.getClubMedia(clubId);
      return clubMedia;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async addClubMedia(inputClubMediaData) {
    try {
      const clubMediaData = { ...inputClubMediaData };
      const { mediaId, media } = clubMediaData;
      //create new media if necessary
      if (!mediaId) {
        //check if media exists
        const checkMedia = await MediaDao.getMediaByKey(media.mediaKey);
        if (checkMedia) {
          clubMediaData.mediaId = checkMedia.id;
        } else {
          //if not create new media and add media id
          const validatedMedia = await MediaValidator.validateNewMedia(media);
          const newMediaId = await MediaDao.createMedia(validatedMedia);
          clubMediaData.mediaId = newMediaId;
        }
      }
      if ("media" in clubMediaData) delete clubMediaData.media;

      const validatedData = await ClubMediaValidator.validateNewClubMedia(
        clubMediaData
      );
      const newClubMediaId = await ClubMediaDao.addClubMedia(validatedData);
      //default thread created with every media
      const defaultThread = {
        clubMediaId: newClubMediaId,
        userId: Number(process.env.ADMIN_ID), //creator is set to an app admin
        title: "Open Discussion",
        default: true,
      };
      await ClubThreadsDao.createNewThread(defaultThread);
      return newClubMediaId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClubMedia(inputClubMediaData) {
    try {
      const validatedData = await ClubMediaValidator.validateDeleteClubMedia(
        inputClubMediaData
      );
      const delId = await ClubMediaDao.deleteClubMedia(validatedData.id);
      return delId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //Club Threads
  async getClubThreads(userId, clubId, clubMediaId, cursor = null) {
    try {
      await ClubMembersValidator.validateUserIsClubMember(userId, clubId);
      const clubThreads = await ClubThreadsDao.getClubThreads(
        clubMediaId,
        cursor
      );
      return clubThreads;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async addClubThread(inputClubThreadData) {
    try {
      const validatedData = await ClubThreadsValidator.validateNewThread(
        inputClubThreadData
      );
      if ("clubId" in validatedData) delete validatedData.clubId;
      const newId = await ClubThreadsDao.createNewThread(validatedData);
      return newId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateClubThread(inputClubThreadData) {
    try {
      const validatedData = await ClubThreadsValidator.validateUpdateThread(
        inputClubThreadData
      );
      await ClubThreadsDao.updateThread(validatedData.id, validatedData.title);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClubThread(inputClubThreadData) {
    try {
      const validatedData = await ClubThreadsValidator.validateDeleteThread(
        inputClubThreadData
      );
      const delId = await ClubThreadsDao.deleteThread(validatedData.id);
      return delId;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  //Club Thread Comments
  async getClubThreadComments(userId, clubId, threadId) {
    try {
      await ClubMembersValidator.validateUserIsClubMember(userId, clubId);
      const threadComments = await ClubThreadCommentsDao.getClubThreadComments({
        threadId,
      });
      return threadComments;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async getCommentReplies(userId, clubId, commentId, cursor = null) {
    try {
      await ClubThreadCommentValidator.validateCommentAndClub(
        commentId,
        clubId
      );
      await ClubMembersValidator.validateUserIsClubMember(userId, clubId);
      const replies = await ClubThreadCommentsDao.getClubThreadComments({
        parentId: commentId,
        parentCursor: cursor,
        threadId: null, //not needed for reply fetching
      });
      return replies;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async addClubThreadComment(inputCommentData) {
    try {
      const validatedData =
        await ClubThreadCommentValidator.validateNewThreadCommment(
          inputCommentData
        );
      const { threadId, userId, content, parentId } = validatedData;
      const newData = {
        threadId,
        userId,
        content,
      };
      if (parentId) newData.parentId = parentId;
      const id = await ClubThreadCommentsDao.addClubThreadComment(newData);
      return id;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async updateClubThreadComment(inputCommentData) {
    try {
      const validatedData =
        await ClubThreadCommentValidator.validateUpdatedThreadComment(
          inputCommentData
        );
      const { id, content } = validatedData;
      await ClubThreadCommentsDao.updateClubThreadComment(id, content);
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async deleteClubThreadComment(inputCommentData) {
    try {
      const validatedData =
        await ClubThreadCommentValidator.validateDeleteThreadComment(
          inputCommentData
        );
      const { id, userId } = validatedData;
      const { replies } = await ClubThreadCommentsDao.getClubThreadComments({
        parentId: id,
      });
      let hardDelete;
      if (!replies) {
        await ClubThreadCommentsDao.hardDeleteClubThreadComment(id);
        hardDelete = true;
      } else {
        await ClubThreadCommentsDao.deleteClubThreadComment(id, userId);
        hardDelete = false;
      }
      return hardDelete;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }
}

export default new ClubsService();
