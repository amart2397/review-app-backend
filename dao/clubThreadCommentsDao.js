import db from "../db/db.js";
import {
  transformClubCommentData,
  transformReturnClubThreadCommentData,
} from "../transformers/transformData.js";
import { clubThreadCommentsColumnsToReturn } from "./config/returnColumnsConfig.js";

class ClubThreadCommentsDao {
  async getClubThreadComments({
    parentId,
    parentCursor = null,
    threadId,
    limit = 50,
    replyReserve = 10,
  }) {
    let budget = limit;
    const topBudget = Math.max(limit - replyReserve, 0);

    // Step 1: Fetch initial nodes
    let currentLevel = [];
    let totalTop = 0;
    let topLevelComments;

    // Count total top-level comments
    if (!parentId) {
      const { count: totalTopRaw } = await db("thread_comments")
        .whereNull("parent_comment_id")
        .andWhere("thread_id", threadId)
        .count("* as count")
        .first();
      totalTop = Number(totalTopRaw);

      const topLevelRaw = await db("thread_comments as c")
        .select(clubThreadCommentsColumnsToReturn)
        .leftJoin("users as u", "c.author_id", "u.id")
        .whereNull("c.parent_comment_id")
        .andWhere("c.thread_id", threadId)
        .orderBy("c.id", "desc")
        .limit(topBudget);

      if (topLevelRaw.length === 0) return {};

      topLevelComments = await Promise.all(
        topLevelRaw.map(async (row) => {
          const nodeData = transformReturnClubThreadCommentData([row]);
          const node = nodeData?.comments?.[0] ?? {};

          // Count immediate children
          const { count } = await db("thread_comments")
            .where("parent_comment_id", node.id)
            .count("* as count")
            .first();

          node.replyCount = Number(count);
          node.repliesLeft = node.replyCount;
          return node;
        })
      );
    } else {
      const { count: totalTopRaw } = await db("thread_comments")
        .where("parent_comment_id", parentId)
        .andWhere("id", "<", parentCursor)
        .count("* as count")
        .first();
      totalTop = Number(totalTopRaw);

      const topLevelRaw = await db("thread_comments as c")
        .select(clubThreadCommentsColumnsToReturn)
        .leftJoin("users as u", "c.author_id", "u.id")
        .where("parent_comment_id", parentId)
        .modify((qb) => {
          if (parentCursor) {
            qb.andWhere("c.id", "<", parentCursor);
          }
        })
        .orderBy("c.id", "desc")
        .limit(topBudget);

      if (topLevelRaw.length === 0) return {};

      topLevelComments = await Promise.all(
        topLevelRaw.map(async (row) => {
          const nodeData = transformReturnClubThreadCommentData([row]);
          const node = nodeData?.comments?.[0] ?? {};

          // Count immediate children
          const { count } = await db("thread_comments")
            .where("parent_comment_id", node.id)
            .count("* as count")
            .first();

          node.replyCount = Number(count);
          node.repliesLeft = node.replyCount;
          return node;
        })
      );
    }

    budget -= topLevelComments.length;

    // Step 2: Round-robin replies per level
    const commentsById = {};
    for (const node of topLevelComments) commentsById[node.id] = node;

    currentLevel = [...topLevelComments];

    while (budget > 0 && currentLevel.length > 0) {
      const nextLevel = [];
      let activeParents = [...currentLevel];

      while (budget > 0 && activeParents.length > 0) {
        const stillActive = [];

        for (const parent of activeParents) {
          if (budget <= 0) break;

          let query = db("thread_comments as c")
            .select(clubThreadCommentsColumnsToReturn)
            .leftJoin("users as u", "c.author_id", "u.id")
            .where("c.parent_comment_id", parent.id)
            .orderBy("c.id", "desc");

          if (parent.nextCursor) {
            query = query.andWhere("c.id", "<", parent.nextCursor);
          }

          const replyRaw = await query.limit(2);

          if (replyRaw.length === 0) {
            parent.repliesLeft = Math.max(
              parent.replyCount - parent.replies.length,
              0
            );
            continue;
          }

          const reply = transformReturnClubThreadCommentData([replyRaw[0]])
            ?.comments?.[0];

          if (!reply) continue;

          // Count children for reply
          const { count } = await db("thread_comments")
            .where("parent_comment_id", reply.id)
            .count("* as count")
            .first();

          reply.replyCount = Number(count);
          reply.repliesLeft = reply.replyCount;

          parent.replies.push(reply);
          parent.repliesLeft = Math.max(
            parent.replyCount - parent.replies.length,
            0
          );

          commentsById[reply.id] = reply;
          nextLevel.push(reply);

          if (replyRaw.length > 1) {
            stillActive.push(parent); // still has more to fetch
          }

          // Advance parent cursor for next round
          parent.nextCursor = reply.id;

          budget -= 1;
        }

        activeParents = stillActive;
      }

      currentLevel = nextLevel;
    }

    // Step 3: Return always in the same shape
    const returnData = {
      topLevel: topLevelComments,
      hasMoreTopLevelComments: totalTop > topBudget,
    };

    if (parentId)
      returnData.nextCursor = topLevelComments[topLevelComments.length - 1].id;

    return returnData;
  }

  async getClubThreadCommentById(commentId) {
    const commentRaw = await db("thread_comments as c")
      .select(clubThreadCommentsColumnsToReturn)
      .leftJoin("users as u", "c.author_id", "u.id")
      .where("c.id", commentId);
    const comment =
      transformReturnClubThreadCommentData(commentRaw)?.comments?.[0];
    return comment;
  }

  async addClubThreadComment(inputCommentData) {
    const transformedData = transformClubCommentData(inputCommentData);
    const [{ id }] = await db("thread_comments")
      .insert(transformedData)
      .returning("id");
    return id;
  }

  async updateClubThreadComment(commentId, updatedContent) {
    await db("thread_comments")
      .where("id", commentId)
      .update({ content: updatedContent });
  }

  async deleteClubThreadComment(commentId, userId) {
    await db("thread_comments")
      .where("id", commentId)
      .update({ deleted_at: new Date(), deleted_by: userId });
  }

  async hardDeleteClubThreadComment(commentId) {
    const [{ id }] = await db("thread_comments")
      .where("id", commentId)
      .returning("id")
      .del();
    return id;
  }
}

export default new ClubThreadCommentsDao();
