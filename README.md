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
- **RBAP** App-level role permissions
- **Admin Moderation** Admin-only routes
- **Reviews** View reviews by media item, user, or club
- **Review Stats** Average ratings by media
- **Club Media** Club media selection and tracking
- **Club Discussion Threads** Club discussion threads
- **Private Reviews** with optional club sharing

### Planned / In Progress

- Personal user profiles

### Testing & CI/CD

Centralized unit and integration test files are in development and will be integrated into a CI/CD workflow once the project is ready for deployment.

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

This project requires a few environment variables (database, API keys, session secret, etc.).  
Please contact the maintainer for details.
