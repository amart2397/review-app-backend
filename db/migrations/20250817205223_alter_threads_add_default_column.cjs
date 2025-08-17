exports.up = async function (knex) {
  await knex.schema.alterTable("threads", (table) => {
    table.boolean("default").notNullable().defaultTo(false);
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("threads", (table) => {
    table.dropColumn("default");
  });
};
