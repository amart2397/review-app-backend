import {
  returnKeyMaps,
  keyMaps,
  postProcessors,
} from "./schemaForTransformers.js";

/**
 * Generic data transformer
 * @param {Object} data - Input data
 * @param {Object} keyMap - Map of inputKey -> dbColumn
 * @param {Function[]} [postProcessors=[]] - Array of functions to run on the transformed object
 * @returns {Object} transformed data
 */
const transformData = (data, keyMap, postProcessors = []) => {
  const renamed = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      const newKey = keyMap[key] || key;
      renamed[newKey] = value;
    }
  }

  for (const fn of postProcessors) {
    fn(renamed);
  }

  return renamed;
};

//Transform incoming Data
export const transformUserData = (data) => transformData(data, keyMaps.user);
export const transformMediaData = (data) =>
  transformData(data, keyMaps.media, [postProcessors.media]);
export const transformReviewData = (data) =>
  transformData(data, keyMaps.review);
export const transformClubData = (data) => transformData(data, keyMaps.club);
export const transformClubInviteData = (data) =>
  transformData(data, keyMaps.clubInvite);
export const transformClubMemberData = (data) =>
  transformData(data, keyMaps.clubMember);
export const transformClubMediaData = (data) =>
  transformData(data, keyMaps.clubMedia);
export const transformClubThreadData = (data) =>
  transformData(data, keyMaps.clubThread);
export const transformClubCommentData = (data) =>
  transformData(data, keyMaps.clubComment);

/**
 * Generic data transformer for database rows to client-facing objects.
 *
 * @param {Object[]} data - Array of database rows to transform
 * @param {Object} keyMap - Mapping of output keys to row fields or functions
 * @param {string} rootKey - Key under which the transformed array is returned
 * @returns {Object|null} Returns null if data is empty, otherwise an object with `nextCursor` and transformed array
 */
const transformReturnData = ({ data, keyMap, rootKey }) => {
  if (!data || data.length === 0) return null;

  const nextCursor = data[data.length - 1].id;

  const transformedArray = data.map((row) => {
    const obj = {};

    for (const [outKey, mapping] of Object.entries(keyMap)) {
      // If mapping is a function, call it with the current row
      if (typeof mapping === "function") {
        setNestedValue(obj, outKey, mapping(row));
      } else {
        // mapping is a string -> direct column
        setNestedValue(obj, outKey, row[mapping]);
      }
    }

    return obj;
  });

  return {
    nextCursor,
    [rootKey]: transformedArray,
  };
};
// Helper to handle nested keys like "author.id"
function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split(".");
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
}

//transform return data
export const transformReturnReviewData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.reviews,
    rootKey: "reviews",
  });
export const transformReturnClubsData = (data) =>
  transformReturnData({ data, keyMap: returnKeyMaps.clubs, rootKey: "clubs" });
export const transformReturnClubInvitesData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.clubInvites,
    rootKey: "invites",
  });
export const transformReturnUserInvitesData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.userInvites,
    rootKey: "invites",
  });
export const transformReturnClubMemberData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.clubMembers,
    rootKey: "members",
  });
export const transformReturnUserClubsData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.userClubs,
    rootKey: "clubs",
  });
export const transformReturnClubMediaData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.clubMedia,
    rootKey: "media",
  });
export const transformReturnClubThreadData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.clubThreads,
    rootKey: "threads",
  });
export const transformReturnClubThreadCommentData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.clubThreadComments,
    rootKey: "comments",
  });
export const transformReturnMediaData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.media,
    rootKey: "media",
  });
export const transformReturnUserData = (data) =>
  transformReturnData({
    data,
    keyMap: returnKeyMaps.users,
    rootKey: "users",
  });
