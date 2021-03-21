const mysql = require('mysql2');
const sharp = require('sharp');

const config = {
    host: "127.0.0.1",
    port: 3306,
    user: "instant",
    password: "instant"
};

async function resizePhoto(pk) {
    console.log("Starting process resize photo with id -> " + pk);

    const dbConnection = await mysql.createConnection(config).promise();
    const [rows] = await dbConnection.execute('SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS WHERE ID = ' + pk);
    const photo = rows[0].PHOTO;

    const photo150 = await sharp(photo)
        .resize(150, 150)
        .toBuffer();

    return dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, RESIZED) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
        [rows[0].NAME, 150, 150, rows[0].LATITUDE, rows[0].LONGITUDE, rows[0].USERNAME, photo150, true]);
}

module.exports = {resizePhoto};