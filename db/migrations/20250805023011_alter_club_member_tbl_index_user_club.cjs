exports.up = async function (knex) {
  await knex.schema.alterTable("club_members", (table) => {
    table.index(["user_id", "club_id"], "idx_club_members_user_club");
    table.unique(["user_id", "club_id"], "unique_user_club");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("club_members", (table) => {
    table.dropIndex(["user_id", "club_id"], "idx_club_members_user_club");
    table.dropUnique(["user_id", "club_id"], "unique_user_club");
  });
};
