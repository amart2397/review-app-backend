import db from "../db/db.js";
import {
  transformPostData,
  transformReturnPostData,
} from "./helpers/transformData.js";
import { postsColumnsToReturn } from "./helpers/returnColumnsConfig.js";

class PostsDao {
  async getAllPosts() {
    const postsRaw = await db("posts")
      .join("users", "posts.user_id", "users.id")
      .join("media", "posts.media_id", "media.id")
      .select(postsColumnsToReturn);
    const posts = postsRaw.map((entry) => transformReturnPostData(entry));
    return posts;
  }

  async createPost(inputPostData) {
    const transformedData = transformPostData(inputPostData);
    const [{ id }] = await db("posts").insert(transformedData).returning("id");
    return id;
  }

  async getPostById(inputPostData) {
    const { id } = inputPostData;
    const postRaw = await db("post")
      .join("users", "posts.user_id", "users.id")
      .join("media", "posts.media_id", "media.id")
      .first(postsColumnsToReturn)
      .where("posts.id", id);
    const post = transformReturnPostData(postRaw);
    return post;
  }

  async updatePost(inputPostData) {
    const transformedData = transformPostData(inputPostData);
    await db("posts").where("id", transformedData.id).update(transformedData);
  }

  async deletePost(inputPostData) {
    const { id } = inputPostData;
    const [delPostId] = await db("posts").where("id", id).returning("id").del();
    return delPostId;
  }

  //More specific post queries
  async getPostsByAuthorId(userId) {
    const postsRaw = await db("post")
      .join("users", "posts.user_id", "users.id")
      .join("media", "posts.media_id", "media.id")
      .first(postsColumnsToReturn)
      .where("posts.user_id", userId);
    const posts = postsRaw.map((entry) => transformReturnPostData(entry));
    return posts;
  }

  async getPostsByMediaId(mediaId) {
    const postsRaw = await db("post")
      .join("users", "posts.user_id", "users.id")
      .join("media", "posts.media_id", "media.id")
      .first(postsColumnsToReturn)
      .where("posts.media_id", mediaId);
    const posts = postsRaw.map((entry) => transformReturnPostData(entry));
    return posts;
  }

  async getPostByAuthorAndMedia(userId, mediaId) {
    const postRaw = await db("post")
      .join("users", "posts.user_id", "users.id")
      .join("media", "posts.media_id", "media.id")
      .first(postsColumnsToReturn)
      .where("users.id", userId)
      .andWhere("media.id", mediaId);
    const post = transformReturnPostData(postRaw);
    return post;
  }
}

export default new PostsDao();
