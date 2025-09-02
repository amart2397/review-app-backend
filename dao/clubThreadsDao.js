import db from "../db/db.js";
import {
  transformClubThreadData,
  transformReturnClubThreadData,
} from "../transformers/transformData.js";
import { clubThreadColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubThreadsDao {
  async getClubThreads(clubMediaId, cursor = null, limit = 10) {
    let query = db("threads as t")
      .join("users as u", "t.created_by", "u.id")
      .where("t.club_media_id", clubMediaId)
      .select(clubThreadColumnsToReturn)
      .orderBy("t.created_at", "desc")
      .limit(limit);

    // If cursor is provided, fetch threads older than that timestamp
    if (cursor) {
      query = query.andWhere("t.created_at", "<", cursor);
    }

    const threadsRaw = await query;
    const threads = transformReturnClubThreadData(threadsRaw);

    return {
      ...threads,
      hasMore: threads.threads.length === limit, // client can check if more available
    };
  }

  async getClubThreadById(threadId) {
    const threadRaw = await db("threads as t")
      .join("users as u", "t.created_by", "u.id")
      .where("t.id", threadId)
      .select(clubThreadColumnsToReturn);
    const thread = transformReturnClubThreadData(threadRaw)?.threads?.[0];
    return thread;
  }

  async createNewThread(inputThreadData) {
    const transformedData = transformClubThreadData(inputThreadData);
    const [{ id }] = await db("threads")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async updateThread(threadId, newTitle) {
    await db("threads").where("id", threadId).update({ title: newTitle });
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
