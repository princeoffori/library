const {app, knex} = require('./index.js');
const request = require('supertest')(app);

beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
})

afterAll( (done) => {
    knex.destroy();
    done();
});

describe("Book API end poitns", () =>{
    it("true equals true", () =>{
        expect(true).toEqual(true);
    })

    it(`should display all books`, (done) => {
        const testBooks=[
                            {id: 1, title: 'Rich Dad Poor Dad', author: 'WhatEver', isbn: '99921-58-10-7', due_date: "2021-01-06T05:00:00.000Z", checked_out: true, user_id: 1},
                            {id: 2, title: 'The Hobbit', author: 'JRR Tolkien', isbn: '85-359-0277-5', due_date: null, checked_out: false, user_id: 2}
                        ];

        request.get('/api/books')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toEqual(testBooks);
                done();
            })

    })

    it(`should display a book`, (done) => {
        const testBooks=[
                            {id: 1, title: 'Rich Dad Poor Dad', author: 'WhatEver', isbn: '99921-58-10-7', due_date: "2021-01-06T05:00:00.000Z", checked_out: true, user_id: 1},
                        ];

        request.get('/api/books/1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body).toEqual(testBooks);
                done();
            })

    })


    it(`should return checkout status of a book that is not checked out`, (done) => {
        request.get('/api/books/2/checkout/2')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                expect(res.body.message).toEqual("Book is available for checkout");
                done();
            })
    })

    it(`should checkout a book`, (done) => {
        const dueDateCalced="2021-01-20T05:00:00.000Z"
        const testBooks=[
                            {id: 2, title: 'The Hobbit', author: 'JRR Tolkien', isbn: '85-359-0277-5', due_date: dueDateCalced, checked_out: true, user_id: 2,}
                        ];

        request.patch('/api/books/2/checkout/2')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                res.body[0].due_date=dueDateCalced;
                expect(res.body).toEqual(testBooks);
                done();
            })
    })

    it(`should return checkout status of a book acting as the person who checked it out`, (done) => {
        request.get('/api/books/2/checkout/2')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                res.body.due_date = "2021-01-20T05:00:00.000Z";
                expect(res.body).toEqual({message: "You already have checked this book out", due_date: "2021-01-20T05:00:00.000Z"});
                done();
            })
    })

    it(`should return checkout status of a book acting as not the person who checked it out`, (done) => {
        request.get('/api/books/2/checkout/1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)
                res.body.due_date = "2021-01-20T05:00:00.000Z";
                expect(res.body).toEqual({message: "This book is already checked out, check after the due date", due_date: "2021-01-20T05:00:00.000Z"});
                done();
            })
    })

})

// This project should satisfy the following criteria:

// 4. As a user, I want to know if a book is available to checkout (if I am the person that checked it out, I should see a message indicating that I have the book already and if someone else checked the book out, I should see a message telling me to check back after the current due date of the book), so that I can save time.
//     API endpoint: `/api/books/:bookId/checkout/:userId`

// 5.  As a librarian, I want to be able to check on the due date for a book that someone just checked out so that I may     keep track of its status and identify the person who checked it out.
//     API endpoint: `/api/books/:bookId`

// 6. As a librarian, I want to be able to update the system for a book that has been returned
//     API endpoint: `/api/books/:bookId/return`
