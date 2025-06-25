exports.up = function (knex) {
  return knex.schema.createTable("media", (table) => {
    table.increments("id");
    table.string("media_type").notNullable();
    table.string("media_key").notNullable();
    table.string("media_title").notNullable();
    table.text("media_description");
    table.string("media_art");
    table.timestamps(true, true);
    table.unique(["media_type", "media_key"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("media");
};
