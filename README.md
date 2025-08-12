# R8R Backend

**R8R** is the backend API for a social platform where people can create and join book or movie review clubs.  
Members can discover new media, leave ratings or reviews, and participate in club-based discussions.

This service handles authentication, authorization, club and review management, and integrates with external APIs for media search — all built with a focus on security and a clean RESTful design.

---

## Features & Roadmap

### Current Features

- **User authentication & authorization**
  - Secure password hashing with `bcrypt`
  - Session-based login with HTTP-only cookies
  - CSRF protection via token headers
- **Review CRUD** for both short “rating-only” and long-form reviews
- **Club CRUD** with public and private options, plus user invitations
- **Media search** via [TMDB API](https://developer.themoviedb.org/docs) and [Google Books API](https://developers.google.com/books)

### Planned / In Progress

- App-level role permissions
- Admin-only routes
- Pagination for all `GET` routes
- View reviews by media item or user
- Average ratings and other review statistics
- Club media selection and tracking
- Club discussion threads
- Private reviews with optional club sharing
- Personal user profiles

---

## Tech Stack

- Node.js (v11.3.0)
- Express.js
- PostgreSQL with Knex.js
- Zod for request validation
- bcrypt for password hashing
- passport for authentication
- CSRF protection with token headers
- TMDB & Google Books APIs

---

## Development Status

This backend is part of a larger project that also includes a dedicated frontend application.
While it is functional, it is not yet production-ready and setup details are intentionally minimal.
Active development is ongoing, with additional features planned in future updates.

You can check out the frontend repository here: [R8R Frontend](https://github.com/amart2397/review-app-frontend)

---

## Quick Start

### Install & Run

```bash
npm install
npm run dev
```

### Required Environment Variables

```
PG_DATABASE=
PG_USER=
PG_PASSWORD=
PG_HOST=
PG_PORT=
ALLOWED_ORIGINS=
NODE_ENV=
SESSION_SECRET=
TMDB_ACCESS_TOKEN=
GOOGLE_BOOKS_API_KEY=
MAX_CLUBS_BY_USER=
```
