exports.up = async function (knex) {
  //Alter threads table (make title not nullable)
  await knex.schema.alterTable("threads", (table) => {
    table.text("title").notNullable().alter();
  });

  //Rename thread_messages to thread_comments
  await knex.schema.renameTable("thread_messages", "thread_comments");

  //Add parent_comment_id for nested replies
  await knex.schema.alterTable("thread_comments", (table) => {
    table
      .integer("parent_comment_id")
      .references("id")
      .inTable("thread_comments")
      .nullable(); // no cascade, soft delete will handle visibility
  });

  //Add soft delete support
  await knex.schema.alterTable("thread_comments", (table) => {
    table.timestamp("deleted_at").nullable();
    table.integer("deleted_by").references("id").inTable("users").nullable();
  });
};

exports.down = async function (knex) {
  //Remove soft delete columns
  await knex.schema.alterTable("thread_comments", (table) => {
    table.dropColumn("deleted_at");
    table.dropColumn("deleted_by");
  });

  //Remove parent_comment_id
  await knex.schema.alterTable("thread_comments", (table) => {
    table.dropColumn("parent_comment_id");
  });

  //Rename back to thread_messages
  await knex.schema.renameTable("thread_comments", "thread_messages");

  //Alter threads table to make title nullable again
  await knex.schema.alterTable("threads", (table) => {
    table.text("title").nullable().alter();
  });
};
