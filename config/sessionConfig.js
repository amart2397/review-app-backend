import env from "dotenv";
env.config();

const sessionConfig = {
  name: "r8r.sid",
  secret: process.env.SESSION_SECRET || "DEVSECRET",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, //1 day
  },
};

export default sessionConfig;
