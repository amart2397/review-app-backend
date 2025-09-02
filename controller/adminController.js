import expressAsyncHandler from "express-async-handler";
import AdminService from "../service/adminService.js";

class AdminController {
  // @desc get all users
  // @route GET /admin/users?cursor
  // @access Private
  getAllUsers = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const users = await AdminService.getAllUsers(cursor);
    res.json(users);
  });

  // @desc delete specific user
  // @route DELETE /admin/users/:userId
  // @access Private
  deleteUser = expressAsyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const delUser = await AdminService.deleteUser(userId);
    res.json({ message: `User with id ${delUser?.id} removed` });
  });

  // @desc update user role
  // @route PATCH /admin/users/:userId
  // @access Private
  updateUserRole = expressAsyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { role } = req.body;
    await AdminService.updateUserRole(userId, role);
    res.json({ message: `User with id ${userId} role changed to ${role}` });
  });

  // @desc get all media
  // @route GET /admin/media?cursor
  // @access Private
  getAllMedia = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const media = await AdminService.getAllMedia(cursor);
    res.json(media);
  });

  // @desc delete specific media
  // @route DELETE /admin/media/:mediaId
  // @access Private
  deleteMedia = expressAsyncHandler(async (req, res) => {
    const mediaId = parseInt(req.params.mediaId);
    const delMedia = await AdminService.deleteMedia(mediaId);
    res.json({ message: `Media with id ${delMedia?.id} removed` });
  });

  // @desc get all reviews
  // @route GET /admin/reviews?cursor
  // @access Private
  getAllReviews = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const reviews = await AdminService.getAllReviews(cursor);
    res.json(reviews);
  });

  // @desc delete specific review
  // @route DELETE /admin/reviews/:reviewId
  // @access Private
  deleteReview = expressAsyncHandler(async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const delReview = await AdminService.deleteReview(reviewId);
    res.json({ message: `Review with id ${delReview?.id} removed` });
  });

  // @desc get all clubs
  // @route GET /admin/clubs?cursor
  // @access Private
  getAllClubs = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const clubs = await AdminService.getAllClubs(cursor);
    res.json(clubs);
  });

  // @desc delete specific club
  // @route DELETE /admin/clubs/:clubId
  // @access Private
  deleteClub = expressAsyncHandler(async (req, res) => {
    const clubId = parseInt(req.params.clubId);
    const delClub = await AdminService.deleteClub(clubId);
    res.json({ message: `Club with id ${delClub?.id} removed` });
  });
}

export default new AdminController();
