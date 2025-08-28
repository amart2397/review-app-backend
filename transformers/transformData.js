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
    displayName: "display_name",
    password: "password",
    role: "role",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
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
    artSmall: "art_small",
    artLarge: "art_large",
    genres: "genres",
    runtime: "runtime",
    authors: "authors",
    publisher: "publisher",
    pageCount: "page_count",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
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
    private: "private",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformClubData = (data) => {
  const newKeys = {
    id: "id",
    name: "name",
    description: "description",
    creatorId: "creator_id",
    mediaType: "media_type",
    isPrivate: "is_private",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformClubInviteData = (data) => {
  const newKeys = {
    id: "id",
    clubId: "club_id",
    inviterId: "inviter_id",
    inviteeId: "invitee_id",
    expiration: "expires_at",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformClubMemberData = (data) => {
  const newKeys = {
    id: "id",
    clubId: "club_id",
    userId: "user_id",
    role: "role",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformClubMediaData = (data) => {
  const newKeys = {
    id: "id",
    clubId: "club_id",
    mediaId: "media_id",
    assignedBy: "assigned_by",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformClubThreadData = (data) => {
  const newKeys = {
    id: "id",
    clubMediaId: "club_media_id",
    userId: "created_by",
    title: "title",
    default: "default",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

export const transformClubCommentData = (data) => {
  const newKeys = {
    id: "id",
    threadId: "thread_id",
    userId: "author_id",
    content: "content",
    parentId: "parent_comment_id",
  };

  const renamed = {};

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const newKey = newKeys[key] || key;
      renamed[newKey] = data[key];
    }
  }

  return renamed;
};

//transform data to return to client
export const transformReturnReviewData = (data) => {
  let cleanData;
  if (data) {
    cleanData = {
      id: data.reviewId,
      title: data.review_title,
      text: data.review_text,
      rating: data.review_rating,
      private: data.private,
      author: {
        id: data.userId,
        displayName: data.display_name,
      },
      media: {
        id: data.mediaId,
        mediaType: data.media_type,
        mediaKey: data.media_key,
        title: data.media_title,
        description: data.media_description,
        artSmall: data.art_small,
        artLarge: data.art_large,
        authors: data.authors,
        releaseDate: data.release_date,
      },
    };
  } else {
    cleanData = null;
  }

  return cleanData;
};

export const transformReturnClubsData = (data) => {
  let cleanData;
  if (data) {
    cleanData = {
      id: data.clubId,
      name: data.clubName,
      description: data.clubDescription,
      mediaType: data.media_type,
      isPrivate: data.is_private,
      creator: {
        id: data.creator_id,
        displayName: data.display_name,
      },
    };
  } else {
    cleanData = null;
  }

  return cleanData;
};

export const transformReturnClubInvitesData = (data) => {
  if (!data || data.length === 0) return null;

  const nextCursor = data[data.length - 1].id;

  return {
    nextCursor,
    clubId: data[0].clubId,
    clubName: data[0].clubName,
    invites: data.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      userName: entry.display_name,
    })),
  };
};

export const transformReturnUserInvitesData = (data) => {
  if (!data || data.length === 0) return null;

  return {
    userId: data[0].inviteeId,
    userName: data[0].inviteeDisplayName,
    invites: data.map((entry) => ({
      id: entry.id,
      inviterId: entry.inviterId,
      inviterName: entry.inviterDisplayName,
      clubId: entry.clubId,
      clubName: entry.clubName,
      expiration: entry.expires_at,
    })),
  };
};

export const transformReturnClubMemberData = (data) => {
  if (!data || data.length === 0) return null;

  const nextCursor = data[data.length - 1].memberId;

  return {
    nextCursor,
    clubId: data[0].clubId,
    clubName: data[0].clubName,
    members: data.map((entry) => ({
      memberId: entry.memberId,
      userId: entry.userId,
      userName: entry.displayName,
      role: entry.memberRole,
    })),
  };
};

export const transformReturnUserClubsData = (data) => {
  if (!data || data.length === 0) return null;

  const nextCursor = data[data.length - 1].clubId;

  return {
    nextCursor,
    userId: data[0].userId,
    userName: data[0].displayName,
    clubs: data.map((entry) => ({
      clubId: entry.clubId,
      clubName: entry.clubName,
      memberId: entry.memberId,
      role: entry.memberRole,
    })),
  };
};

export const transformReturnClubMediaData = (data) => {
  if (!data || data.length === 0) return null;

  const nextCursor = data[data.length - 1].clubMediaId;

  return {
    nextCursor,
    clubId: data[0].clubId,
    clubName: data[0].clubName,
    clubType: data[0].mediaType,
    media: data.map((entry) => ({
      clubMediaId: entry.clubMediaId,
      mediaId: entry.mediaId,
      title: entry.mediaTitle,
      description: entry.mediaDescrription,
      artSmall: entry.art_small,
      artLarge: entry.art_large,
      authors: entry.authors,
      releaseDate: entry.release_date,
      publisher: entry.publisher,
      runtime: entry.runtime,
      assignedBy: entry.creatorId
        ? {
            id: entry.creatorId,
            displayName: entry.displayName,
          }
        : { id: null, displayName: "[deleted]" },
    })),
  };
};

export const transformReturnClubThreadData = (data) => {
  if (!data || data.length === 0) return null;

  return {
    threadId: data.threadId,
    title: data.title,
    clubMediaId: data.clubMediaId,
    creator: {
      id: data.creatorId,
      displayName: data.displayName,
    },
    createdAt: data.created_at,
  };
};

export const transformReturnClubThreadCommentData = (data) => {
  if (!data || data.length === 0) return null;

  const isDeleted = !!data.deleted_at;

  return {
    id: data.commentId,
    content: isDeleted ? null : data.content,
    deleted: isDeleted,
    createdAt: data.created_at,
    parentCommentId: data.parent_comment_id,
    threadId: data.thread_id,
    author: data.author_id
      ? { id: data.author_id, displayName: data.displayName }
      : { id: null, displayName: "[deleted]" },
    replyCount: 0, //default to 0 and adjust in dao method
    repliesLeft: 0, //default to 0 and adjust in dao method
    nextCursor: null, //default to null and adjust in dao method
    replies: [],
  };
};
