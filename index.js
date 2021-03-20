const express = require('express')
const mysql = require('mysql');
const app = express()

const con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "instantuser",
    password: "instantpassword"
});

app.get('/photos', function (req, res) {
    const sql = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, UPDATED_AT, CREATED_AT FROM instant.PHOTOS;';
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Result: " + JSON.stringify(result));
        })
    });
    res.status(200).send('HI');
})

app.post('/upload-photo', function (req, res) {
    res.status(200).send('HI');
})

app.listen(3000)