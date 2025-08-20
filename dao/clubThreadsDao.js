import db from "../db/db.js";
import {
  transformClubThreadData,
  transformReturnClubThreadData,
} from "../transformers/transformData.js";
import { clubThreadColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubThreadsDao {
  async getClubThreads(clubMediaId, cursor = null, limit = 10) {
    let query = db("threads")
      .join("users", "threads.created_by", "users.id")
      .where("threads.club_media_id", clubMediaId)
      .select(clubThreadColumnsToReturn)
      .orderBy("threads.created_at", "desc")
      .limit(limit);

    // If cursor is provided, fetch threads older than that timestamp
    if (cursor) {
      query = query.andWhere("threads.created_at", "<", cursor);
    }

    const threadsRaw = await query;

    const threads = threadsRaw.map((entry) =>
      transformReturnClubThreadData(entry)
    );

    // Next cursor = created_at of the last thread in this batch
    const nextCursor =
      threads.length > 0 ? threads[threads.length - 1].createdAt : null;

    return {
      threads,
      nextCursor,
      hasMore: threads.length === limit, // client can check if more available
    };
  }

  async getClubThreadById(threadId) {
    const threadRaw = await db("threads")
      .join("users", "threads.created_by", "users.id")
      .where("threads.id", threadId)
      .first(clubThreadColumnsToReturn);
    const thread = transformReturnClubThreadData(threadRaw);
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
