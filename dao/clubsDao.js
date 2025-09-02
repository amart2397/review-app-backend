import db from "../db/db.js";
import { clubsColumnsToReturn } from "./config/returnColumnsConfig.js";
import {
  transformReturnClubsData,
  transformClubData,
} from "../transformers/transformData.js";

class ClubsDao {
  async getPublicClubs(cursor = null, limit = 15) {
    const clubsRaw = await db("clubs as c")
      .leftJoin("users as u", "c.creator_id", "u.id")
      .select(clubsColumnsToReturn)
      .where("c.is_private", false)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("c.id", "<", cursor);
        }
      })
      .orderBy("c.id", "desc")
      .limit(limit);
    const clubs = transformReturnClubsData(clubsRaw);
    return clubs;
  }

  async getClubsForUser(userId, cursor = null, limit = 20) {
    const clubsRaw = await db("clubs as c")
      .leftJoin("users as u", "c.creator_id", "u.id")
      .join("club_members as cm", "c.id", "cm.club_id")
      .select(clubsColumnsToReturn)
      .where("cm.user_id", userId)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("c.id", "<", cursor);
        }
      })
      .orderBy("c.id", "desc")
      .limit(limit);
    const clubs = transformReturnClubsData(clubsRaw);
    return clubs;
  }

  async getAllClubs(cursor = null, limit = 30) {
    const clubsRaw = await db("clubs as c")
      .leftJoin("users as u", "c.creator_id", "u.id")
      .select(clubsColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("c.id", "<", cursor);
        }
      })
      .orderBy("c.id", "desc")
      .limit(limit);
    const clubs = transformReturnClubsData(clubsRaw);
    return clubs;
  }

  async createClub(inputClubData) {
    const transformedData = transformClubData(inputClubData);
    const [{ id }] = await db("clubs").insert(transformedData).returning("id");
    return id;
  }

  async updateClub(inputClubData) {
    const { id, name, isPrivate } = inputClubData;
    const updateData = transformClubData({ name, isPrivate });
    await db("clubs").where("id", id).update(updateData);
  }

  async deleteClub(inputClubData) {
    const { id } = inputClubData;
    const [delClub] = await db("clubs")
      .where("id", id)
      .returning(["id", "name"])
      .del();
    return delClub;
  }

  async getClubsByCreator(creatorId) {
    const clubsRaw = await db("clubs as c")
      .join("users as u", "c.creator_id", "u.id")
      .select(clubsColumnsToReturn)
      .where("c.creator_id", creatorId);
    const clubs = transformReturnClubsData(clubsRaw);
    return clubs;
  }

  async getClubById(clubId) {
    const clubRaw = await db("clubs as c")
      .join("users as u", "c.creator_id", "u.id")
      .select(clubsColumnsToReturn)
      .where("c.id", clubId);
    const club = transformReturnClubsData(clubRaw).clubs?.[0];
    return club;
  }
}

export default new ClubsDao();
