import db from "../db/db.js";
import { transformClubThreadData } from "../transformers/transformData.js";

class ClubThreadsDao {
  async getClubThreads(clubMediaId) {
    const threads = await db("threads")
      .where("club_media_id", clubMediaId)
      .select();
    return threads;
  }

  async getClubThreadById(threadId) {
    const thread = await db("threads").where("id", threadId).first();
    return thread;
  }

  async createNewThread(inputThreadData) {
    const transformedData = transformClubThreadData(inputThreadData);
    const [{ id }] = await db("threads")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async deleteThread(threadId) {
    const [{ id }] = await db("threads")
      .where("id", threadId)
      .returning("id")
      .del();
    return id;
  }
}

export default new ClubThreadsDao();
