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

export const transformPostData = (data) => {
  const newKeys = {
    id: "id",
    userId: "user_id",
    mediaId: "media_id",
    postTitle: "post_title",
    postText: "post_text",
    postRating: "post_rating",
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

//transform post data to return to client
export const transformReturnPostData = (data) => {
  let cleanData;
  if (data) {
    cleanData = {
      id: data.postId,
      title: data.post_title,
      text: data.post_text,
      rating: post.post_rating,
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
        artUrl: data.media_art,
      },
    };
  } else {
    cleanData = null;
  }

  return cleanData;
};
