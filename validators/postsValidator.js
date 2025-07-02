import * as z from "zod/v4";
import PostsDao from "../dao/postsDao.js";
import UsersDao from "../dao/UsersDao.js";
import AppError from "../utils/AppError.js";
import compareSchema from "./helpers/compareSchema.js";

//Data schemas
const newPostSchema = z.object({
  userId: z.int(),
  mediaId: z.int(),
  postTitle: z.string(),
  postText: z.string(),
  postRating: z.number().nonnegative().multipleOf(0.1).max(10),
});

const updatePostSchema = z.object({
  id: z.int(),
  userId: z.int(),
  mediaId: z.int(),
  postTitle: z.string(),
  postText: z.string(),
  postRating: z.number().nonnegative().multipleOf(0.1).max(10),
});

const postIdSchema = z.object({
  id: z.int(),
});

class PostsValidator {
  //schema validation (using zod)
  validateNewPostSchema(inputPostData) {
    return compareSchema(newPostSchema, inputPostData);
  }

  validatePostIdSchema(inputPostData) {
    return compareSchema(postIdSchema, inputPostData);
  }

  validateUpdatePostSchema(inputPostData) {
    return compareSchema(updatePostSchema, inputPostData);
  }

  //app logic validation
  async validateNewPost(inputPostData) {
    //Check that a review doesn't already exist
    const { userId, mediaId } = inputPostData;
    const existingPost = PostsDao.getPostByAuthorAndMedia(userId, mediaId);
    if (existingPost) {
      throw AppError.conflict("User already created post");
    }
    //Check that user gave valid media and user ids
    const author = UsersDao.getUserById(userId);
    if (!author) {
      throw AppError.badRequest("Post author not found");
    }
    return inputPostData;
  }

  async validateUpdatePost(inputPostData) {
    const { id, userId, mediaId } = inputPostData;
    const existingPostById = PostsDao.getPostById(id);
    const existingPostByAuthor = PostsDao.getPostByAuthorAndMedia(
      userId,
      mediaId
    );
    if (existingPostById && existingPostById?.Author.id !== userId) {
    }
  }

  async validateDeletePost(inputPostData) {}
}

export default PostsValidator();
