const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const enviroment = (process.env.NODE_ENV || process.env.ENVIROMENT || 'test').toLowerCase().trim();
const knex = require('knex')(require('./knexfile.js')[enviroment]);

if (enviroment!='test'){
    knex.migrate.rollback().then(async () => {//Makes sure database is setup right
        return knex.migrate.latest().then(()=>{
            return knex.seed.run();
        });
    });
}

app.use(express.json());
app.use(cors());

app.get('/api/books', (req, res) => {
    knex('books')
        .select('*')
        .then(data => res.status(200).send(data))
        .catch(err =>
            res.status(404).json({
                message:
                    'What you are looking for is not here Homie'
            }))
})

app.get('/api/books/:id', (req, res) => {
    knex('books')
        .select('*')
        .where('id', req.params.id)
        .then(data => res.status(200).send(data))
        .catch(err =>
            res.status(404).json({
                message:
                    'What you are looking for is not here Homie'
            }))
})

app.patch('/api/books/:bookId/checkout/:userId', (req, res) => {
    knex('books')
        .update({due_date: (new Date().toUTCString()), checked_out: true, user_id: Number(req.params.userId)})
        .where('id', req.params.bookId)
        .returning("*")
        .then(data => res.status(200).send(data))
        .catch(err =>
            res.status(404).json({
                message:
                    'What you are looking for is not here Homie'
            }))
})

app.get('/api/books/:bookId/checkout/:userId', (req, res) => {
    knex('books')
        .select('*')
        .where('id', req.params.bookId)
        .then(books => {
            const book=books[0];
            if (book.checked_out===true){
                if (Number(req.params.userId)===book.user_id){
                    res.status(200).send({message: "You already have checked this book out", due_date: book.due_date});
                }else{
                    res.status(200).send({message: "This book is already checked out, check after the due date", due_date: book.due_date});
                }
            }else{
                res.status(200).send({message: "Book is available for checkout"});
            }
        })
        .catch(err =>
            res.status(404).json({
                message:
                    'What you are looking for is not here Homie'
        }));
})

app.patch('/api/books/:bookId/return', (req, res) => {
    knex('books')
        .update({checked_out: false})
        .where('id', req.params.bookId)
        .returning("*")
        .then(data => res.status(200).send(data))
        .catch(err =>
            res.status(404).json({
                message:
                    'What you are looking for is not here Homie'
            }))
})

//C - create (post)
//R - retrieve (get)
//U - update (patch, put)
//D - delete

// knex('books')
//   .where('published_date', '<', 2000)
//   .update({
//     status: 'archived',
//     thisKeyIsSkipped: undefined
//   })

app.listen(port, ()=> console.log("Listening on "+ port));

module.exports={app, knex};