exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("display_name");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("display_name");
  });
};
