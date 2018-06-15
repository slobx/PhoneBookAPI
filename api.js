// setup database
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:'); // database will be stored in RAM only

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS phone_book (id INTEGER PRIMARY KEY, name TEXT, last_name TEXT, phone TEXT)");
    db.run("INSERT INTO phone_book (name, last_name, phone) VALUES (?, ?, ?)", "Bob", "Washington", "+381641234567");
    db.run("INSERT INTO phone_book (name, last_name, phone) VALUES (?, ?, ?)", "Alice", "Marlon", "+38163122333");
    db.run("INSERT INTO phone_book (name, last_name, phone) VALUES (?, ?, ?)", "Lee", "Jackson", "+381628000111");
});

// define api object
const express = require('express');
const api = express();
let bodyParser = require('body-parser');
api.use(bodyParser.json());

// define API endpoints

//get contact by ID
api.get('/api:id', (req, res) => {
    const id = req.params['id'];
    db.get("SELECT * FROM phone_book WHERE id=(?)", id, function (err, row) {
        res.json({
            "name": row.name,
            "last_name": row.last_name,
            "phone": row.phone,
        });
    });
});


//get all contacts
api.get('/api/contacts.json', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    db.all("SELECT * FROM phone_book", function (err, row) {
        res.json(row);
    });
});

api.post('/api/post',  function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.body);
    // let sql = 'INSERT INTO phone_book (name, last_name, phone) VALUES (?, ?, ?)';
    // let data = [
    //     req.body.name,
    //     req.body.last_name,
    //     req.body.phone
    // ];
    //
    // db.run(sql, data,
    //     function(err) {
    //         if (err) {
    //             return console.error(err.message);
    //         }
    //         console.log(`Rows inserted`);
    //     }
    //     );
});

// run server
    api.listen(3000, () => console.log('Listening on port 3000...'));