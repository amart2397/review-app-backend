import expressAsyncHandler from "express-async-handler";
import MediaSearchService from "../service/mediaSearchService.js";

class MediaSearchController {
  // @desc get book query results from Google Books API
  // @route GET /media-search/books/?query
  // @access Private
  getBookQuery = expressAsyncHandler(async (req, res) => {
    const { title, author, page, transform } = req.query;
    const data = await MediaSearchService.queryBooks({
      title,
      author,
      page: Number(page) || 1,
      transform,
    });
    res.json(data);
  });

  // @desc get full book data from Google Books API for specific book id
  // @route GET /media-search/books/:id
  // @access Private
  getBookById = expressAsyncHandler(async (req, res) => {
    const bookId = req.params.id;
    const { transform } = req.query;
    const data = await MediaSearchService.getBookById({
      bookId,
      transform,
    });
    res.json(data);
  });

  // @desc get movie query results from TMDB API
  // @route GET /media-search/movies/?query
  // @access Private
  getMovieQuery = expressAsyncHandler(async (req, res) => {
    const { title, year, page, transform } = req.query;
    const data = await MediaSearchService.queryMovies({
      title,
      year: Number(year) || "",
      page: Number(page) || 1,
      transform,
    });
    res.json(data);
  });

  // @desc get full movie data from TMDB API for specific movie id
  // @route GET /media-search/movies/:id
  // @access Private
  getMovieById = expressAsyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const { transform } = req.query;
    const data = await MediaSearchService.getMovieById({
      movieId,
      transform,
    });
    res.json(data);
  });
}

export default new MediaSearchController();
