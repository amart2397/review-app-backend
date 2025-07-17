import db from "../db/db.js";
import { mediaColumnsToReturn } from "../config/returnColumnsConfig.js";
import { transformMediaData } from "../transformers/transformData.js";

class MediaDao {
  async getAllMedia() {
    const media = await db("media").select(mediaColumnsToReturn);
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
      .returning(["id", "media_title"])
      .del();
    return delMedia;
  }

  //helper queries
  async getMediaById(id) {
    const media = await db("media").first(mediaColumnsToReturn).where("id", id);
    return media;
  }

  async getMediaByKey(mediaKey) {
    const media = await db("media")
      .first(mediaColumnsToReturn)
      .where("media_key", mediaKey);
    return media;
  }

  async getMediaByType(type) {
    const media = await db("media")
      .first(mediaColumnsToReturn)
      .where("media_type", type);
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
