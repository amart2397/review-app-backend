exports.up = async function (knex) {
  await knex.schema.alterTable("users", function (table) {
    table.string("profile_color", 7).notNullable().defaultTo("#82DCD2");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("users", function (table) {
    table.dropColumn("profile_color");
  });
};
