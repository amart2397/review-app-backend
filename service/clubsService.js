import ClubsDao from "../dao/clubsDao.js";
import ClubsValidator from "../validators/clubsValidator.js";
import AppError from "../utils/AppError.js";
import handleError from "../utils/handleError.js";
import ClubInviteValidator from "../validators/clubInviteValidator.js";
import ClubInvitesDao from "../dao/clubInvitesDao.js";
import ClubMembersDao from "../dao/clubMembersDao.js";
import ClubMembersValidator from "../validators/clubMembersValidator.js";

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

  async getClubInvites(clubId) {
    try {
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
  async getClubMembers(clubId) {
    try {
      const members = await ClubMembersDao.getClubMembers(clubId);
      return members;
    } catch (err) {
      if (err instanceof AppError) throw err;
      handleError(err);
    }
  }

  async addClubMember(inputClubMemberData) {
    try {
      const validatedData = await ClubMembersValidator.validateNewClubMember(
        inputClubMemberData
      );
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
      await ClubMembersDao.updateMemberRole(validatedData.id, role);
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
}

export default new ClubsService();
