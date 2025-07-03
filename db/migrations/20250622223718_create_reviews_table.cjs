exports.up = function (knex) {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("id");
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.integer("media_id").notNullable().references("id").inTable("media");
    table.string("review_title").notNullable();
    table.text("review_text").notNullable();
    table.decimal("review_rating", 3, 1).notNullable();
    table.timestamps(true, true);
    table.unique(["user_id", "media_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reviews");
};
