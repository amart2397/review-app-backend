/**
 * These functions transform input data to match database table schema
 * @param {Object} data input data object
 * @returns {Object} renamed data object
 */

export const transformUserData = (data) => {
  const newKeys = {
    id: "id",
    email: "email",
    firstName: "first_name",
    lastName: "last_name",
    password: "password",
    role: "role",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformMediaData = (data) => {
  const newKeys = {
    id: "id",
    mediaType: "media_type",
    mediaKey: "media_key",
    title: "title",
    description: "description",
    releaseDate: "release_date",
    imgSmall: "art_small",
    imgLarge: "art_large",
    genres: "genres",
    runtime: "runtime",
    authors: "authors",
    publisher: "publisher",
    pageCount: "page_count",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  //stringify genre array before insert into jsonb field.  this accepts both arrays and objects
  if (Array.isArray(renamed.genres) || typeof renamed.genres === "object") {
    renamed.genres = JSON.stringify(renamed.genres);
  }

  return renamed;
};

export const transformReviewData = (data) => {
  const newKeys = {
    id: "id",
    userId: "user_id",
    mediaId: "media_id",
    reviewTitle: "review_title",
    reviewText: "review_text",
    reviewRating: "review_rating",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

//transform review data to return to client
export const transformReturnReviewData = (data) => {
  let cleanData;
  if (data) {
    cleanData = {
      id: data.reviewId,
      title: data.review_title,
      text: data.review_text,
      rating: data.review_rating,
      author: {
        id: data.userId,
        firstName: data.first_name,
        lastName: data.last_name,
      },
      media: {
        id: data.mediaId,
        type: data.media_type,
        title: data.media_title,
        description: data.media_description,
        artUrl: data.art_large,
      },
    };
  } else {
    cleanData = null;
  }

  return cleanData;
};
