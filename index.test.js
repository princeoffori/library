const {app, knex} = require('./index.js');
const request = require('supertest')(app);

beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
})

afterAll(async function (done) {
    const client = knex;
    await client.destroy();
    await done();
});

describe("Book API end poitns", () => {

    it(`should display all books`, done => {
        const testBooks=[
                            {id: 1, title: 'Rich Dad Poor Dad', author: 'WhatEver', isbn: '99921-58-10-7', due_date: "2021-01-07T07:00:00.000Z", checked_out: true, user_id: 1},
                            {id: 2, title: 'The Hobbit', author: 'JRR Tolkien', isbn: '85-359-0277-5', due_date: null, checked_out: false, user_id: 2}
                        ];

        request.get('/api/books')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual(testBooks);
                done();
            })
            .catch(err => done(err))
    })

    it(`should display a book`, done => {
        const testBooks=[
                            {id: 1, title: 'Rich Dad Poor Dad', author: 'WhatEver', isbn: '99921-58-10-7', due_date: "2021-01-07T07:00:00.000Z", checked_out: true, user_id: 1},
                        ];

        request.get('/api/books/1')
            .expect(200)
            .then(res => {
                expect(res.body).toEqual(testBooks);
                done();
            })
            .catch(err => done(err))
    })



    it(`should return checkout status of a book that is not checked out`, done => {
        request.get('/api/books/2/checkout/2')
            .expect(200)
            .then(res => {
                expect(res.body.message).toEqual("Book is available for checkout");
                done();
            })
            .catch(err => done(err))
    })


    it(`should checkout a book`, (done) => {
        const dueDateCalced="2021-01-20T05:00:00.000Z"
        const testBooks=[
                            {id: 2, title: 'The Hobbit', author: 'JRR Tolkien', isbn: '85-359-0277-5', due_date: dueDateCalced, checked_out: true, user_id: 2,}
                        ];

        request.patch('/api/books/2/checkout/2')
            .expect(200)
            .then(res => {
                res.body[0].due_date=dueDateCalced;
                expect(res.body).toEqual(testBooks);
                done();
            })
            .catch(err => done(err))
    })

    it(`should return checkout status of a book acting as the person who checked it out`, done => {
        request.get('/api/books/2/checkout/2')
            .expect(200)
            .then(res => {
                res.body.due_date = "2021-01-20T05:00:00.000Z";
                expect(res.body).toEqual({message: "You already have checked this book out", due_date: "2021-01-20T05:00:00.000Z"});
                done();
            })
            .catch(err => done(err))
    })

    it(`should return checkout status of a book acting as not the person who checked it out`, done => {
        request.get('/api/books/2/checkout/1')
            .expect(200)
            .then(res => {
                res.body.due_date = "2021-01-20T05:00:00.000Z";
                expect(res.body).toEqual({message: "This book is already checked out, check after the due date", due_date: "2021-01-20T05:00:00.000Z"});
                done();
            })
            .catch(err => done(err))
    })


    it(`should checkin a book`, done => {
        request.patch('/api/books/2/return')
            .expect(200)
            .then(res => {
                expect(res.body[0].checked_out).toEqual(false);
                done();
            })
            .catch(err => done(err))
    })
})

// This project should satisfy the following criteria:



// 6. As a librarian, I want to be able to update the system for a book that has been returned
//     API endpoint: `/api/books/:bookId/return`
