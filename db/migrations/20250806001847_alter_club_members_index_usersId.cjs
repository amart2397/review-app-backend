exports.up = async function (knex) {
  await knex.schema.alterTable("club_members", (table) => {
    table.index("user_id", "idx_club_members_user");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("club_members", (table) => {
    table.dropIndex("user_id", "idx_club_members_user");
  });
};
