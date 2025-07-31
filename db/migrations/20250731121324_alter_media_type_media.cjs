exports.up = async function (knex) {
  // 1. Change media_type to enum using existing enum type
  await knex.schema.alterTable("media", (table) => {
    table.dropUnique(["media_type", "media_key"]);
    table.dropColumn("media_type");
  });

  await knex.schema.alterTable("media", (table) => {
    table
      .specificType("media_type", "media_type_enum") // use existing type
      .notNullable();
    table.unique(["media_type", "media_key"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("media", (table) => {
    table.dropUnique(["media_type", "media_key"]);
    table.dropColumn("media_type");
  });

  await knex.schema.alterTable("media", (table) => {
    table.string("media_type").notNullable();
    table.unique(["media_type", "media_key"]);
  });
};
