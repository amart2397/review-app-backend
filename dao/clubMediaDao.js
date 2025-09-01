import db from "../db/db.js";
import {
  transformClubMediaData,
  transformReturnClubMediaData,
} from "../transformers/transformData.js";
import { clubMediaColumnsToReturn } from "./config/returnColumnsConfig.js";

const groupByColumns = clubMediaColumnsToReturn.map((col) =>
  col.split(" as ")[0].trim()
); //Clear out alias names for groupBy

class ClubMediaDao {
  async getClubMedia(clubId, cursor = null, limit = 20) {
    const clubMediaRaw = await db("club_media as cmd")
      .join("clubs as c", "cmd.club_id", "c.id")
      .join("media as m", "cmd.media_id", "m.id")
      .leftJoin("users as u", "cmd.assigned_by", "u.id")
      .leftJoin("reviews as r", "m.id", "r.media_id")
      .leftJoin("review_club_shares as rcs", function () {
        this.on("rcs.review_id", "=", "r.id").andOnVal("rcs.club_id", clubId);
      })
      .where("cmd.club_id", clubId)
      .groupBy(groupByColumns)
      .select(
        ...clubMediaColumnsToReturn,
        db.raw(
          `AVG(CASE WHEN r.private IS NOT TRUE THEN r.review_rating END)::numeric(4,2) as global_average_rating`
        ),
        db.raw(
          "AVG(CASE WHEN r.private IS NOT TRUE AND r.user_id IN (SELECT user_id FROM club_members WHERE club_id = ?) THEN r.review_rating WHEN r.private IS TRUE AND rcs.id IS NOT NULL THEN r.review_rating END)::numeric(4,2) AS club_average_rating",
          [clubId]
        )
      )
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

  async getClubMediaById(clubMediaId, clubId) {
    const clubMediaRaw = await db("club_media as cmd")
      .join("clubs as c", "cmd.club_id", "c.id")
      .join("media as m", "cmd.media_id", "m.id")
      .leftJoin("users as u", "cmd.assigned_by", "u.id")
      .leftJoin("reviews as r", "m.id", "r.media_id")
      .leftJoin("review_club_shares as rcs", function () {
        this.on("rcs.review_id", "=", "r.id").andOnVal("rcs.club_id", clubId);
      })
      .where("cmd.id", clubMediaId)
      .groupBy(groupByColumns)
      .select(
        ...clubMediaColumnsToReturn,
        db.raw(
          `AVG(CASE WHEN r.private IS NOT TRUE THEN r.review_rating END)::numeric(4,2) as global_average_rating`
        ),
        db.raw(
          "AVG(CASE WHEN r.private IS NOT TRUE AND r.user_id IN (SELECT user_id FROM club_members WHERE club_id = ?) THEN r.review_rating WHEN r.private IS TRUE AND rcs.id IS NOT NULL THEN r.review_rating END)::numeric(4,2) AS club_average_rating",
          [clubId]
        )
      );
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
