// Centralized mapping definitions
export const keyMaps = {
  user: {
    id: "id",
    email: "email",
    firstName: "first_name",
    lastName: "last_name",
    displayName: "display_name",
    password: "password",
    role: "role",
  },
  media: {
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
  },
  review: {
    id: "id",
    userId: "user_id",
    mediaId: "media_id",
    reviewTitle: "review_title",
    reviewText: "review_text",
    reviewRating: "review_rating",
    private: "private",
  },
  club: {
    id: "id",
    name: "name",
    description: "description",
    creatorId: "creator_id",
    mediaType: "media_type",
    isPrivate: "is_private",
  },
  clubInvite: {
    id: "id",
    clubId: "club_id",
    inviterId: "inviter_id",
    inviteeId: "invitee_id",
    expiration: "expires_at",
  },
  clubMember: {
    id: "id",
    clubId: "club_id",
    userId: "user_id",
    role: "role",
  },
  clubMedia: {
    id: "id",
    clubId: "club_id",
    mediaId: "media_id",
    assignedBy: "assigned_by",
  },
  clubThread: {
    id: "id",
    clubMediaId: "club_media_id",
    userId: "created_by",
    title: "title",
    default: "default",
  },
  clubComment: {
    id: "id",
    threadId: "thread_id",
    userId: "author_id",
    content: "content",
    parentId: "parent_comment_id",
  },
};

// Centralized post-processors for special cases
export const postProcessors = {
  media: (renamed) => {
    if (Array.isArray(renamed.genres) || typeof renamed.genres === "object") {
      renamed.genres = JSON.stringify(renamed.genres);
    }
  },
};

//Return object key mapping
export const returnKeyMaps = {
  reviews: {
    id: "id",
    title: "review_title",
    text: "review_text",
    rating: "review_rating",
    private: "private",
    "author.id": "userId", //dot notation keys used for nested objects
    "author.displayName": "display_name",
    "media.id": "mediaId",
    "media.mediaType": "media_type",
    "media.mediaKey": "media_key",
    "media.title": "media_title",
    "media.description": "media_description",
    "media.artSmall": "art_small",
    "media.artLarge": "art_large",
    "media.authors": "authors",
    "media.releaseDate": "release_date",
  },

  clubs: {
    id: "id",
    name: "clubName",
    description: "clubDescription",
    mediaType: "media_type",
    isPrivate: "is_private",
    "creator.id": "creator_id",
    "creator.displayName": "display_name",
  },

  clubInvites: {
    id: "id",
    userId: "userId",
    userName: "display_name",
  },

  userInvites: {
    id: "id",
    inviterId: "inviterId",
    inviterName: "inviterDisplayName",
    clubId: "clubId",
    clubName: "clubName",
    expiration: "expires_at",
  },

  clubMembers: {
    id: "id",
    userId: "userId",
    userName: "displayName",
    role: "memberRole",
  },

  userClubs: {
    id: "id",
    clubName: "clubName",
    memberId: "memberId",
    role: "memberRole",
  },

  clubMedia: {
    id: "id",
    mediaId: "mediaId",
    title: "mediaTitle",
    description: "mediaDescription",
    artSmall: "art_small",
    artLarge: "art_large",
    authors: "authors",
    releaseDate: "release_date",
    publisher: "publisher",
    runtime: "runtime",
    assignedBy: (row) =>
      row.creatorId
        ? { id: row.creatorId, displayName: row.displayName }
        : { id: null, displayName: "[deleted]" },
  },

  clubThreads: {
    id: "id",
    title: "title",
    clubMediaId: "clubMediaId",
    creator: (row) => ({ id: row.creatorId, displayName: row.displayName }),
    createdAt: "created_at",
  },

  clubThreadComments: {
    id: "id",
    content: (row) => (row.deleted_at ? null : row.content),
    deleted: (row) => !!row.deleted_at,
    createdAt: "created_at",
    parentCommentId: "parent_comment_id",
    threadId: "thread_id",
    author: (row) =>
      row.author_id
        ? { id: row.author_id, displayName: row.displayName }
        : { id: null, displayName: "[deleted]" },
    replyCount: () => 0,
    repliesLeft: () => 0,
    nextCursor: () => null,
    replies: () => [],
  },

  media: {
    id: "mediaId",
    mediaType: "media_type",
    mediaKey: "media_key",
    title: "media_title",
    description: "media_description",
    artSmall: "art_small",
    artLarge: "art_large",
    authors: "authors",
    releaseDate: "release_date",
  },

  users: {
    id: "id",
    displayName: "display_name",
    role: "role",
  },
};
