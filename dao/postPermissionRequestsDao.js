import db from "../db/db.js";
import { postPermReqColumnsToReturn } from "./config/returnColumnsConfig.js";
import { transformReturnPermReqData } from "../transformers/transformData.js";

class PostPermissionRequestsDao {
  async getPendingRequests(cursor = null, limit = 30) {
    const requestsRaw = await db("post_permission_requests as pr")
      .join("users as u", "pr.user_id", "u.id")
      .where("pr.status", "pending")
      .select(postPermReqColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("pr.id", "<", cursor);
        }
      })
      .orderBy("pr.id", "desc")
      .limit(limit);
    const requests = transformReturnPermReqData(requestsRaw);
    return requests;
  }

  async getProcessedRequests(cursor = null, limit = 30) {
    const requestsRaw = await db("post_permission_requests as pr")
      .join("users as u", "pr.user_id", "u.id")
      .whereNot("pr.status", "pending")
      .select(postPermReqColumnsToReturn)
      .modify((qb) => {
        if (cursor) {
          qb.andWhere("pr.id", "<", cursor);
        }
      })
      .orderBy("pr.id", "desc")
      .limit(limit);
    const requests = transformReturnPermReqData(requestsRaw);
    return requests;
  }

  async getRequestById(id) {
    const requestRaw = await db("post_permission_requests as pr")
      .join("users as u", "pr.user_id", "u.id")
      .where("pr.id", id)
      .select(postPermReqColumnsToReturn);
    const request = transformReturnPermReqData(requestRaw)?.requests?.[0];
    return request;
  }

  async getRequestByUser(userId) {
    const requestRaw = await db("post_permission_requests as pr")
      .join("users as u", "pr.user_id", "u.id")
      .where("pr.user_id", userId)
      .select(postPermReqColumnsToReturn);
    const request = transformReturnPermReqData(requestRaw)?.requests?.[0];
    return request;
  }

  async addRequest(userId) {
    const [{ id }] = await db("post_permission_requests")
      .insert({
        user_id: userId,
      })
      .returning("id");
    return id;
  }

  async updateRequest(id, reviewerId, newStatus) {
    await db("post_permission_requests").where("id", id).update({
      status: newStatus,
      reviewed_at: db.fn.now(),
      reviewed_by: reviewerId,
    });
  }

  async deleteRequest(delId) {
    const [{ id }] = await db("post_permission_requests")
      .where("id", delId)
      .returning("id")
      .del();
    return id;
  }
}

export default new PostPermissionRequestsDao();
