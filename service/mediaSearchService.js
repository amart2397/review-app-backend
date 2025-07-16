import AppError from "../utils/AppError.js";
import env from "dotenv";
import { strictBookFilter } from "../utils/strictBookFilter.js";
env.config();

class MediaSearchService {
  constructor(
    baseBookUrl = "https://www.googleapis.com/books/v1/volumes",
    baseMovieUrl = ""
  ) {
    this.baseBookUrl = baseBookUrl;
    this.baseMovieUrl = baseMovieUrl;
  }

  queryBooks = async ({ title, author = "", page = 1 }) => {
    //Input must be at least 3 characters before sending to google api
    if (!title || title.trim().length < 3) {
      throw AppError.badRequest("Title must be at least 3 characters long");
    }

    //create pagination setup and api key
    const maxResults = 10;
    const startIndex = (page - 1) * maxResults;
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    //build query and full url then fetch
    const query =
      `?q=intitle:${encodeURIComponent(title)}` +
      (author ? `+inauthor:${encodeURIComponent(author)}` : "");

    const url =
      this.baseBookUrl +
      query +
      `&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw AppError.externalApiError(
          `Google Books API Error: ${res.status}`
        );
      }
      //pull raw data then check that author and title have matches. if not return empty object. This is required since Google Books is fuzzy
      const rawData = await res.json();
      const strictData = strictBookFilter(rawData.items || [], title, author);
      if (strictData.length === 0) {
        return { kind: "books#volumes", totalItems: 0, items: [] };
      } else {
        return rawData;
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (!(process.env.NODE_ENV === "production")) {
        console.error(err);
      }
      throw AppError.externalApiError("Failed to fetch from Google Books API");
    }
  };
}

export default new MediaSearchService();
