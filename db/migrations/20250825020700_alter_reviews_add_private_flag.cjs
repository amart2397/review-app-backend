exports.up = async function (knex) {
  await knex.schema.alterTable("reviews", function (table) {
    table.boolean("private").notNullable().defaultTo(false);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("reviews", function (table) {
    table.dropColumn("private");
  });
};
