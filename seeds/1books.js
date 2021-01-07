
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('books').del()
    .then(function () {
      // Inserts seed entries
      return knex('books').insert([
        {title: 'Rich Dad Poor Dad', author: 'WhatEver', isbn: '99921-58-10-7', due_date: knex.fn.now(), checked_out: true, user_id: 1},
        {title: 'The Hobbit', author: 'JRR Tolkien', isbn: '85-359-0277-5', checked_out: false, user_id: 2},
      ]);
    });
};

