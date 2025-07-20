import AppError from "../utils/AppError.js";
import env from "dotenv";
import { strictBookFilter } from "../utils/strictBookFilter.js";
import {
  transformBooks,
  transformFullBook,
} from "../transformers/transformGoogleData.js";
import {
  transformFullMovie,
  transformMovies,
} from "../transformers/transformTMDBData.js";
env.config();

class MediaSearchService {
  constructor(
    baseBookUrl = "https://www.googleapis.com/books/v1/volumes",
    baseMovieUrl = "https://api.themoviedb.org/3/search/movie",
    baseMovieIdUrl = "https://api.themoviedb.org/3/movie"
  ) {
    this.baseBookUrl = baseBookUrl;
    this.baseMovieUrl = baseMovieUrl;
    this.baseMovieIdUrl = baseMovieIdUrl;
  }

  queryBooks = async ({ title, author = "", page = 1, transform = true }) => {
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
        if (transform) return transformBooks({ ...rawData, items: strictData });
        return { ...rawData, items: strictData };
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (!(process.env.NODE_ENV === "production")) {
        console.error(err);
      }
      throw AppError.externalApiError("Failed to fetch from Google Books API");
    }
  };

  getBookById = async ({ bookId, transform = true }) => {
    const url = this.baseBookUrl + `/${encodeURIComponent(bookId)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw AppError.externalApiError(
          `Google Books API Error: ${res.status}`
        );
      }
      const rawData = await res.json();
      if (transform) return transformFullBook(rawData);
      return rawData;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (!(process.env.NODE_ENV === "production")) {
        console.error(err);
      }
      throw AppError.externalApiError("Failed to fetch from Google Books API");
    }
  };

  queryMovies = async ({ title, year = 1874, page = 1, transform = true }) => {
    //check params align with rules and ranges
    if (!title || title.trim().length < 3) {
      throw AppError.badRequest("Title must be at least 3 characters long");
    }
    const maxYear = new Date().getFullYear() + 1;
    if (year && (year < 1874 || year > maxYear)) {
      throw AppError.badRequest(
        `Please enter a date between 1874 and ${maxYear}`
      );
    }
    if (page < 1 || page > 500) {
      throw AppError.badRequest(
        `Please enter a page nummber betweeen 1 and 500`
      );
    }

    //build url and fetch
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    const query =
      `?query=${encodeURIComponent(
        title
      )}&include_adult=false&language=en-US&page=${page}` +
      (year && `&year=${year}`);
    try {
      const res = await fetch(this.baseMovieUrl + query, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: "application/json",
        },
      });

      if (!res.ok) {
        throw AppError.externalApiError(`TMDB API Error: ${res.status}`);
      }

      const data = await res.json();
      if (transform) return transformMovies(data);
      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (!(process.env.NODE_ENV === "production")) {
        console.error(err);
      }
      throw AppError.externalApiError("Failed to fetch from TMDB API");
    }
  };

  getMovieById = async ({ movieId, transform = true }) => {
    //build url and fetch
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    const url = this.baseMovieIdUrl + `/${encodeURIComponent(movieId)}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: "application/json",
        },
      });

      if (!res.ok) {
        throw AppError.externalApiError(`TMDB API Error: ${res.status}`);
      }

      const data = await res.json();
      if (transform) return transformFullMovie(data);
      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (!(process.env.NODE_ENV === "production")) {
        console.error(err);
      }
      throw AppError.externalApiError("Failed to fetch from TMDB API");
    }
  };
}

export default new MediaSearchService();
