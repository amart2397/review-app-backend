import env from "dotenv";
env.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

export default allowedOrigins;
