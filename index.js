const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.listen(3000)

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "instant",
    password: "instant"
};

app.get('/photos', async (req, res) => {
    const query = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, UPDATED_AT, CREATED_AT FROM instant.PHOTOS;';
    const dbConnection = await mysql.createConnection(config).promise();
    const [rows] = await dbConnection.execute(query);
    console.log("Result: " + JSON.stringify(rows));
    res.status(200).send(rows);
})

app.post('/upload', jsonParser, async (req, res) => {
    console.log("req: " + JSON.stringify(req.body));
    res.status(200).send('HI');
})

console.log("listening at 3000")