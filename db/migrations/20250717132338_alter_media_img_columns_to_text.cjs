exports.up = function (knex) {
  return knex.schema.alterTable("media", (table) => {
    table.text("art_small").alter();
    table.text("art_large").alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("media", (table) => {
    table.string("art_small", 255).alter();
    table.string("art_large", 255).alter();
  });
};
