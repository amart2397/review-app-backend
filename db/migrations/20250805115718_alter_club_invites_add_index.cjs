exports.up = async function (knex) {
  await knex.schema.alterTable("club_invites", (table) => {
    table.index(["invitee_id", "club_id"], "idx_club_invites_user_club");
    table.unique(["invitee_id", "club_id"], "unique_user_club_invite");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("club_invites", (table) => {
    table.dropIndex(["invitee_id", "club_id"], "idx_club_invites_user_club");
    table.dropUnique(["invitee_id", "club_id"], "unique_user_club_invite");
  });
};
