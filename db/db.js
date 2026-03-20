import knex from "knex";
import knexfile from "../knexfile.cjs";

const knexEnv = process.env.DB_ENV || process.env.NODE_ENV || "local";
const config = knexfile[knexEnv];

if (!config) {
  throw new Error(
    `Unknown Knex env "${knexEnv}". Expected one of: ${Object.keys(knexfile).join(", ")}`,
  );
}

const db = knex(config);

export default db;
