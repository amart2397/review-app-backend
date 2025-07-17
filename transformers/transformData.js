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
    mediaTitle: "title",
    mediaDescription: "description",
    mediaArt: "artLarge",
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
        artUrl: data.artLarge,
      },
    };
  } else {
    cleanData = null;
  }

  return cleanData;
};
