const mysql = require('mysql2');
const fs = require('fs');
const { sendNotify } = require('./rabbitmq-service');

const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'instant',
  password: 'instant',
};

const queryAllPhoto = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS ORDER BY CREATED_AT DESC;';
const queryResizedPhoto = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS WHERE RESIZED = TRUE ORDER BY CREATED_AT DESC;';
const insertStatement = 'INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO) VALUES(?, ?, ?, ?, ?, ?, ?)';

// get resized or all photos from database
async function getPhotos(resized) {
  const dbConnection = await mysql.createConnection(config).promise();
  let query;
  if (resized) {
    query = queryResizedPhoto;
  } else {
    query = queryAllPhoto;
  }
  return dbConnection.query(query);
}

// upload photo and send notify to rabbitmq service
async function uploadPhoto(fields, files) {
  const rawData = fs.readFileSync(files.IMAGE.path);
  const dbConnection = await mysql.createConnection(config).promise();
  const record = await dbConnection.query(insertStatement, [fields.NAME, fields.WEIGHT, fields.LENGTH, fields.LATITUDE, fields.LONGITUDE, fields.USERNAME, rawData]);
  const pk = record[0].insertId;
  return sendNotify(pk);
}

module.exports = { getPhotos, uploadPhoto };
