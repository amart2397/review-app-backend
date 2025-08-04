exports.up = function (knex) {
  return knex.schema.alterTable("clubs", function (table) {
    table.dropColumn("description");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("clubs", function (table) {
    table.text("description");
  });
};
