
exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
    table.increments('id');
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('media_id').notNullable().references('id').inTable('media');
    table.string('post_title').notNullable();
    table.text('post_text').notNullable();
    table.decimal('post_rating', 3, 1).notNullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'media_id']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
