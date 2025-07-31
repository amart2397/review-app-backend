exports.up = async function (knex) {
  await knex.schema.createTable("clubs", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("description");
    table
      .integer("creator_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enu("media_type", ["book", "movie"], {
        useNative: true,
        enumName: "media_type_enum",
      })
      .notNullable();
    table.boolean("is_private").defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable("club_members", (table) => {
    table.increments("id");
    table
      .integer("club_id")
      .notNullable()
      .references("id")
      .inTable("clubs")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enu("role", ["member", "admin", "creator"], {
        useNative: true,
        enumName: "club_member_role_enum",
      })
      .defaultTo("member");
    table.timestamps(true, true);
    table.unique(["club_id", "user_id"]);
  });

  await knex.schema.createTable("club_invites", (table) => {
    table.increments("id");
    table
      .integer("club_id")
      .notNullable()
      .references("id")
      .inTable("clubs")
      .onDelete("CASCADE");
    table
      .integer("inviter_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.text("invitee_email").notNullable();
    table.text("token").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("expires_at");
    table.boolean("accepted").defaultTo(false);
  });

  await knex.schema.createTable("club_media", (table) => {
    table.increments("id");
    table
      .integer("club_id")
      .notNullable()
      .references("id")
      .inTable("clubs")
      .onDelete("CASCADE");
    table
      .integer("media_id")
      .notNullable()
      .references("id")
      .inTable("media")
      .onDelete("CASCADE");
    table
      .integer("assigned_by")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.timestamp("assigned_at").defaultTo(knex.fn.now());
    table.unique(["club_id", "media_id"]);
  });

  await knex.schema.createTable("threads", (table) => {
    table.increments("id");
    table
      .integer("club_media_id")
      .notNullable()
      .references("id")
      .inTable("club_media")
      .onDelete("CASCADE");
    table
      .integer("created_by")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.text("title");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("thread_messages", (table) => {
    table.increments("id");
    table
      .integer("thread_id")
      .notNullable()
      .references("id")
      .inTable("threads")
      .onDelete("CASCADE");
    table
      .integer("author_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("review_club_shares", (table) => {
    table.increments("id");
    table
      .integer("review_id")
      .notNullable()
      .references("id")
      .inTable("reviews")
      .onDelete("CASCADE");
    table
      .integer("club_id")
      .notNullable()
      .references("id")
      .inTable("clubs")
      .onDelete("CASCADE");
    table.unique(["review_id", "club_id"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("review_club_shares");
  await knex.schema.dropTableIfExists("thread_messages");
  await knex.schema.dropTableIfExists("threads");
  await knex.schema.dropTableIfExists("club_media");
  await knex.schema.dropTableIfExists("club_invites");
  await knex.schema.dropTableIfExists("club_members");
  await knex.schema.dropTableIfExists("clubs");
  await knex.raw("DROP TYPE IF EXISTS media_type_enum");
  await knex.raw("DROP TYPE IF EXISTS club_member_role_enum");
};
