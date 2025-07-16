import expressAsyncHandler from "express-async-handler";
import MediaSearchService from "../service/mediaSearchService.js";

class MediaSearchController {
  // @desc get book query results from Google Books API
  // @route GET /media-search/books/?query
  // @access Private
  getBookQuery = expressAsyncHandler(async (req, res) => {
    const { title, author, page } = req.query;
    const data = await MediaSearchService.queryBooks({
      title,
      author,
      page: Number(page) || 1,
    });
    res.json(data);
  });
}

export default new MediaSearchController();
