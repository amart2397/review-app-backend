import db from "../db/db.js";
import { mediaColumnsToReturn } from "./config/returnColumnsConfig.js";
import {
  transformMediaData,
  transformReturnMediaData,
} from "../transformers/transformData.js";

class MediaDao {
  async getAllMedia(cursor = null, limit = 20) {
    const mediaRaw = await db("media as m")
      .leftJoin("reviews as r", "m.id", "r.media_id")
      .groupBy(mediaColumnsToReturn)
      .select(
        ...mediaColumnsToReturn,
        db.raw(
          `AVG(CASE WHEN r.private IS NOT TRUE THEN r.review_rating END)::numeric(4,2) as global_average_rating`
        )
      )
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("m.id", "<", cursor);
        }
      })
      .orderBy("m.id", "desc")
      .limit(limit);
    const media = transformReturnMediaData(mediaRaw);
    return media;
  }

  async createMedia(inputMediaData) {
    const transformedData = transformMediaData(inputMediaData);
    const [{ id }] = await db("media").insert(transformedData).returning("id");
    return id;
  }

  async updateMedia(inputMediaData) {
    const transformedData = transformMediaData(inputMediaData);
    await db("media").where("id", transformedData.id).update(transformedData);
  }

  async deleteMedia(inputMediaData) {
    const { id } = inputMediaData;
    const [delMedia] = await db("media")
      .where("id", id)
      .returning(["id", "title"])
      .del();
    return delMedia;
  }

  //helper queries
  async getMediaById(id) {
    const mediaRaw = await db("media as m")
      .leftJoin("reviews as r", "m.id", "r.media_id")
      .where("m.id", id)
      .groupBy(mediaColumnsToReturn)
      .select(
        ...mediaColumnsToReturn,
        db.raw(
          `AVG(CASE WHEN r.private IS NOT TRUE THEN r.review_rating END)::numeric(4,2) as global_average_rating`
        )
      );
    const media = transformReturnMediaData(mediaRaw)?.media?.[0];
    return media;
  }

  async getMediaByKey(mediaKey) {
    const media = await db("media")
      .first(mediaColumnsToReturn)
      .where("media_key", mediaKey);
    return media;
  }

  async getMediaByKeyAndType(mediaKey, type) {
    const media = await db("media")
      .first(mediaColumnsToReturn)
      .where("media_type", type)
      .andWhere("media_key", mediaKey);
    return media;
  }
}

export default new MediaDao();
