import db from "../db/db.js";
import {
  transformClubMediaData,
  transformReturnClubMediaData,
} from "../transformers/transformData.js";
import { clubMediaColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubMediaDao {
  async getClubMedia(clubId, cursor = null, limit = 20) {
    const clubMediaRaw = await db("club_media as cmd")
      .join("clubs as c", "cmd.club_id", "c.id")
      .join("media as m", "cmd.media_id", "m.id")
      .leftJoin("users as u", "cmd.assigned_by", "u.id")
      .where("cmd.club_id", clubId)
      .select(clubMediaColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("cmd.id", "<", cursor);
        }
      })
      .orderBy("cmd.id", "desc")
      .limit(limit);
    const clubMedia = transformReturnClubMediaData(clubMediaRaw);
    return clubMedia;
  }

  async getClubMediaByClubAndMediaId(clubId, mediaId) {
    const clubMediaRaw = await db("club_media as cmd")
      .join("clubs as c", "cmd.club_id", "c.id")
      .join("media as m", "cmd.media_id", "m.id")
      .join("users as u", "cmd.assigned_by", "u.id")
      .where("cmd.club_id", clubId)
      .where("cmd.media_id", mediaId)
      .select(clubMediaColumnsToReturn);
    const clubMedia = transformReturnClubMediaData(clubMediaRaw).media?.[0];
    return clubMedia;
  }

  async getClubMediaById(clubMediaId) {
    const clubMediaRaw = await db("club_media as cmd")
      .join("clubs as c", "cmd.club_id", "c.id")
      .join("media as m", "cmd.media_id", "m.id")
      .join("users as u", "cmd.assigned_by", "u.id")
      .where("cmd.id", clubMediaId)
      .select(clubMediaColumnsToReturn);
    const clubMedia = transformReturnClubMediaData(clubMediaRaw).media?.[0];
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
