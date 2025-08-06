exports.up = async function (knex) {
  await knex.schema.alterTable("club_invites", (table) => {
    table.index("invitee_id", "idx_club_invites_invitee_id");
    table.index("club_id", "idx_club_invites_club_id");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("club_invites", (table) => {
    table.dropIndex("invitee_id", "idx_club_invites_invitee_id");
    table.dropIndex("club_id", "idx_club_invites_club_id");
  });
};
