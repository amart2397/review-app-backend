// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
require("dotenv").config();

console.log("loaded knexfile");

const maybeSsl = (sslMode) => {
  // Neon typically requires SSL; setting sslmode=require should enable this.
  if (sslMode === "require") {
    return { rejectUnauthorized: false };
  }
  return undefined;
};

const commonKnexConfig = {
  client: "pg",
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

module.exports = {
  local: {
    ...commonKnexConfig,
    connection: {
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      port: Number(process.env.PG_PORT),
    },
  },
  development: {
    ...commonKnexConfig,
    connection: {
      host: process.env.NEON_PG_HOST,
      database: process.env.NEON_PG_DATABASE,
      user: process.env.NEON_PG_USER,
      password: process.env.NEON_PG_PASSWORD,
      port: Number(process.env.NEON_PG_PORT),
      ssl: maybeSsl(process.env.NEON_PGSSLMODE),
    },
  },
};
