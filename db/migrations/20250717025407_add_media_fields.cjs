exports.up = function (knex) {
  return knex.schema.alterTable("media", (table) => {
    table.string("release_date").nullable();
    table.jsonb("genres").nullable();
    table.string("publisher").nullable();
    table.string("authors").nullable();
    table.integer("runtime").nullable();
    table.integer("page_count").nullable();
    table.string("art_small").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("media", (table) => {
    table.dropColumn("release_date");
    table.dropColumn("genres");
    table.dropColumn("publisher");
    table.dropColumn("authors");
    table.dropColumn("runtime");
    table.dropColumn("page_count");
    table.dropColumn("art_small");
  });
};
