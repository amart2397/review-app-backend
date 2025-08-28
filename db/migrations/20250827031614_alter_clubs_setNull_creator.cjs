exports.up = async function (knex) {
  await knex.schema.alterTable("clubs", (table) => {
    table.dropForeign("creator_id");
  });

  await knex.schema.alterTable("clubs", (table) => {
    table.integer("creator_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("clubs", (table) => {
    table
      .foreign("creator_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("clubs", (table) => {
    table.dropForeign("creator_id");
  });

  await knex.schema.alterTable("clubs", (table) => {
    table.integer("creator_id").unsigned().notNullable().alter();
  });

  await knex.schema.alterTable("clubs", (table) => {
    table
      .foreign("creator_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};
