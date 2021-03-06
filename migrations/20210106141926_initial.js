
exports.up = function(knex) {
    return knex.schema
    .createTable('users', table => {
        table.increments('id');
        table.string('username').notNullable();
    })
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
    return knex.schema.dropTableIfExists('books').dropTableIfExists('users');
};


/*      Books Table Schema
            id int                      table.increments('id')
            Title, varchar              table.string('title')
            Author, varchar             table.string('author')
            ISBN varchar,               table.string('isbn')
            Date datetime               table.date('due_date')
            checked_out bool            table.boolean('checked_out')
            UserId int - foreign        table.increments('user_id')
                                            table.foreign('user_id')
                                            .references('user')

        Users Table Schema
            id int                      table.increments('id')
            username, varchar           table.string('username')
*/