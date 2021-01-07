
exports.up = function(knex) {
    return knex.schema
    .createTable('books', table =>{
        table.increments('id');
        table.string('title').notNullable();
        table.string('author').notNullable();
        table.string('isbn');
        table.date('due_date');
        table.boolean('checked_out');
        table.integer('user_id');

        table.foreign('user_id').references('id').inTable('users');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('books');
};
