import db from "../db/db.js";
import { clubsColumnsToReturn } from "./config/returnColumnsConfig.js";
import {
  transformReturnClubsData,
  transformClubData,
} from "../transformers/transformData.js";

class ClubsDao {
  async getPublicClubs() {
    const clubsRaw = await db("clubs")
      .join("users", "clubs.creator_id", "users.id")
      .select(clubsColumnsToReturn)
      .where("clubs.is_private", false);
    const clubs = clubsRaw.map((entry) => transformReturnClubsData(entry));
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
    const clubsRaw = await db("clubs")
      .join("users", "clubs.creator_id", "users.id")
      .select(clubsColumnsToReturn)
      .where("clubs.creator_id", creatorId);
    const clubs = clubsRaw.map((entry) => transformReturnClubsData(entry));
    return clubs;
  }

  async getClubById(clubId) {
    const clubRaw = await db("clubs")
      .join("users", "clubs.creator_id", "users.id")
      .first(clubsColumnsToReturn)
      .where("clubs.id", clubId);
    const club = transformReturnClubsData(clubRaw);
    return club;
  }
}

export default new ClubsDao();
