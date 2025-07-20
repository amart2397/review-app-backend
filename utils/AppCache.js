import env from "dotenv";
env.config();

const simpleDevCache = new Map();
const TTL = 1000 * 60 * 60;
const timestamps = new Map();

const isDev = process.env.NODE_ENV !== "production";

export const getFromCache = (key) => {
  if (!isDev) return null;
  const now = Date.now();
  const timestamp = timestamps.get(key);

  if (timestamp && now - timestamp < TTL) {
    return simpleDevCache.get(key);
  }

  simpleDevCache.delete(key);
  timestamps.delete(key);
  return null;
};

export const setToCache = (key, value) => {
  if (isDev) {
    simpleDevCache.set(key, value);
    timestamps.set(key, Date.now());
  }
};
