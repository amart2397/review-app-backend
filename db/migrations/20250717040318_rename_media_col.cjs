exports.up = function (knex) {
  return knex.schema.alterTable("media", (table) => {
    table.renameColumn("media_title", "title");
    table.renameColumn("media_description", "description");
    table.renameColumn("media_art", "art_large");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("media", (table) => {
    table.renameColumn("title", "media_title");
    table.renameColumn("description", "media_description");
    table.renameColumn("art_large", "media_art");
  });
};
