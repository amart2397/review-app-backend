import rateLimit from "express-rate-limit";

export const googleRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 20, // max 20 requests per IP per minute
  message: "Too many Google Books requests, please try again later.",
});

export const TMDBRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 sec window
  max: 40, // max 40 requests per IP per 10 seconds
  message: "Too many TMDB requests, please try again later.",
});
