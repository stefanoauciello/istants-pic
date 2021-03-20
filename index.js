const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');
const app = express();

const jsonParser = bodyParser.json()
app.listen(3000)
console.log("listening at 3000")

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
    res.status(200).json({
        rows: rows
    })
})

app.post('/upload',
    jsonParser,
    body("NAME").notEmpty().isString(),
    body("WEIGHT").notEmpty().isNumeric(),
    body("LENGTH").notEmpty().isNumeric(),
    body("LATITUDE").notEmpty().isString(),
    body("LONGITUDE").notEmpty().isString(),
    body("USERNAME").notEmpty().isString(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        res.status(200).json({
            success: true,
            message: 'Success',
        })
    });