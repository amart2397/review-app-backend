exports.up = async function (knex) {
  await knex.schema.alterTable("club_invites", (table) => {
    table.dropColumn("token");
    table.dropColumn("invitee_email");

    table
      .integer("invitee_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("club_invites", (table) => {
    table.text("invitee_email").notNullable();
    table.text("token").notNullable().unique();

    table.dropColumn("invitee_id");
  });
};
