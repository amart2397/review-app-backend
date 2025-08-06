exports.up = function (knex) {
  return knex.schema.alterTable("club_invites", function (table) {
    table.dropColumn("accepted");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("clubs", function (table) {
    table.boolean("accepted").defaultTo(false);
  });
};
