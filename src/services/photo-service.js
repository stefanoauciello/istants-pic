const mysql = require('mysql2');
const {sendNotify} = require("./rabbitmq-service");

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "instant",
    password: "instant"
};

async function getPhotos(req, res) {
    try {
        const dbConnection = await mysql.createConnection(config).promise();
        const [rows] = await dbConnection.execute('SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, UPDATED_AT, CREATED_AT FROM instant.PHOTOS ORDER BY CREATED_AT DESC;');
        res.status(200).json({
            rows: rows
        })
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
    return res;
}

async function uploadPhoto(req, res) {
    try {
        const dbConnection = await mysql.createConnection(config).promise();
        const record = await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME) VALUES(?, ?, ?, ?, ?, ?)',
            [req.body.NAME, req.body.WEIGHT, req.body.LENGTH, req.body.LATITUDE, req.body.LONGITUDE, req.body.USERNAME]);
        const pk = record[0].insertId;
        await sendNotify(pk)
        res.status(200).json({
            success: true,
            message: 'Success',
        })
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
    return res;
}

module.exports = {getPhotos, uploadPhoto};