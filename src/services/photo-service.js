const mysql = require('mysql2');
const fs = require('fs');
const {sendNotify} = require("./rabbitmq-service");

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "instant",
    password: "instant"
};

async function getPhotos() {
    const dbConnection = await mysql.createConnection(config).promise();
    return dbConnection.query('SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS ORDER BY CREATED_AT DESC;');
}

async function uploadPhoto(fields, files, res) {
    const rawData = fs.readFileSync(files.IMAGE.path)
    const dbConnection = await mysql.createConnection(config).promise();
    const record = await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [fields.NAME, fields.WEIGHT, fields.LENGTH, fields.LATITUDE, fields.LONGITUDE, fields.USERNAME, rawData]);
    const pk = record[0].insertId;
    return sendNotify(pk)
}

module.exports = {getPhotos, uploadPhoto};