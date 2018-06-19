// setup database
let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:'); // database will be stored in RAM only

//creates db table
db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS phone_book (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, last_name TEXT, phone TEXT)");
});

//initial app setup
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//API endpoints

//get contact by ID
app.get('/api:id', (req, res) => {
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
app.get('/api/contacts_list', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    db.all("SELECT * FROM phone_book", function (err, row) {
        if (row) {
            res.json(row);
        } else {
            return {}
        }
    });
});

//save contact
app.post('/api/add_contact', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let sql = 'INSERT INTO phone_book (name, last_name, phone) VALUES (?, ?, ?)';
    let data = [
        req.body.name,
        req.body.last_name,
        req.body.phone
    ];

    db.run(sql, data,
        function (err) {
            if (err) {
                return console.error(err.message);
            } else {
                console.log(`Rows inserted`);
                res.send('Success');
            }
        }
    );
});

//delete contact
app.delete('/api/delete_contact', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.body);

    db.run(`DELETE FROM phone_book WHERE id=?`, req.body.id, function (err) {
        if (err) {
            return console.error(err.message);
        } else {
            console.log(`Row(s) deleted ${this.changes}`);
            res.send('Success');
        }
    });


});

// run server
app.listen(process.env.PORT || 5000);