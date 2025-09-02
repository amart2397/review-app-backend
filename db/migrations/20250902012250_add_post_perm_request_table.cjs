exports.up = async function (knex) {
  await knex.schema.createTable("post_permission_requests", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enum("status", ["pending", "approved", "denied"])
      .notNullable()
      .defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("reviewed_at").nullable();
    table
      .integer("reviewed_by")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("post_permission_requests");
};
