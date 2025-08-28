import db from "../db/db.js";
import {
  transformClubMediaData,
  transformReturnClubMediaData,
} from "../transformers/transformData.js";
import { clubMediaColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubMediaDao {
  async getClubMedia(clubId, cursor = null, limit = 20) {
    const clubMediaRaw = await db("club_media")
      .join("clubs", "club_media.club_id", "clubs.id")
      .join("media", "club_media.media_id", "media.id")
      .leftJoin("users", "club_media.assigned_by", "users.id")
      .where("club_media.club_id", clubId)
      .select(clubMediaColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("club_media.id", "<", cursor);
        }
      })
      .orderBy("club_media.id", "desc")
      .limit(limit);
    const clubMedia = transformReturnClubMediaData(clubMediaRaw);
    return clubMedia;
  }

  async getClubMediaByClubAndMediaId(clubId, mediaId) {
    const clubMediaRaw = await db("club_media")
      .join("clubs", "club_media.club_id", "clubs.id")
      .join("media", "club_media.media_id", "media.id")
      .join("users", "club_media.assigned_by", "users.id")
      .where("club_media.club_id", clubId)
      .where("club_media.media_id", mediaId)
      .select(clubMediaColumnsToReturn);
    const clubMedia = transformReturnClubMediaData(clubMediaRaw);
    return clubMedia;
  }

  async getClubMediaById(clubMediaId) {
    const clubMediaRaw = await db("club_media")
      .join("clubs", "club_media.club_id", "clubs.id")
      .join("media", "club_media.media_id", "media.id")
      .join("users", "club_media.assigned_by", "users.id")
      .where("club_media.id", clubMediaId)
      .select(clubMediaColumnsToReturn);
    const clubMedia = transformReturnClubMediaData(clubMediaRaw);
    return clubMedia;
  }

  async addClubMedia(inputClubMediaData) {
    const transformedData = transformClubMediaData(inputClubMediaData);
    const [{ id }] = await db("club_media")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async deleteClubMedia(clubMediaId) {
    const [{ id }] = await db("club_media")
      .where("id", clubMediaId)
      .returning("id")
      .del();
    return id;
  }
}

export default new ClubMediaDao();
