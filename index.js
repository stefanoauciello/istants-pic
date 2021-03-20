const express = require('express')
const mysql = require('mysql2');
const app = express()

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "instantuser",
    password: "instantpassword"
};

app.get('/photos', async (req, res) => {
    const query = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, UPDATED_AT, CREATED_AT FROM instant.PHOTOS;';
    const dbConnection = await mysql.createConnection(config).promise();
    const [rows] = await dbConnection.execute(query);
    console.log("Result: " + JSON.stringify(rows));
    res.status(200).send(rows);
})

app.post('/upload-photo', async (req, res) => {
    res.status(200).send('HI');
})

app.listen(3000)