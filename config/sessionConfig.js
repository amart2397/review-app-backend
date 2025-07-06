import env from "dotenv";
import db from "../db/db.js";
import { ConnectSessionKnexStore } from "connect-session-knex";
env.config();

const store = new ConnectSessionKnexStore({
  knex: db,
  tableName: "sessions",
  createTable: true,
  cleanupInterval: 1000 * 60 * 60 * 24,
});

const sessionConfig = {
  name: "r8r.sid",
  secret: process.env.SESSION_SECRET || "DEVSECRET",
  resave: false,
  store,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //1 day
  },
};

export default sessionConfig;
