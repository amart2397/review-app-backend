import expressAsyncHandler from "express-async-handler";
import AdminService from "../service/adminService.js";

class AdminController {
  // @desc get all pending post perm requests
  // @route GET /admin/permissions/pending?cursor
  // @access Private
  getPendingRequests = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const requests = await AdminService.getPendingRequests(cursor);
    res.json(requests);
  });

  // @desc get all processed post perm requests
  // @route GET /admin/permissions/processed?cursor
  // @access Private
  getProcessedRequests = expressAsyncHandler(async (req, res) => {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
    const requests = await AdminService.getProcessedRequests(cursor);
    res.json(requests);
  });

  // @desc respond to a post perm request
  // @route POST /admin/permissions/:id
  // @access Private
  respondToRequest = expressAsyncHandler(async (req, res) => {
    const requestId = parseInt(req.params.id);
    const adminId = parseInt(req.user.id);
    const { accepted } = req.body;
    await AdminService.respondToRequest(requestId, accepted, adminId);
    res.json({ message: `Request with id ${requestId} processed` });
  });

  // @desc delete a request
  // @route DELETE /admin/permissions/:id
  // @access Private
  deleteRequest = expressAsyncHandler(async (req, res) => {
    const requestId = parseInt(req.params.id);
    const delId = await AdminService.deleteRequest(requestId);
    res.json({ message: `Request with id ${delId} deleted` });
  });

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
