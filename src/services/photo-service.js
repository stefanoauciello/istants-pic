const fs = require('fs');
const { sendNotify } = require('./rabbitmq-service');
const { dbConnection } = require('./database-service');

const queryAllPhoto = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS ORDER BY CREATED_AT DESC;';
const queryResizedPhoto = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS WHERE RESIZED = TRUE ORDER BY CREATED_AT DESC;';
const insertStatement = 'INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO) VALUES(?, ?, ?, ?, ?, ?, ?)';

// get resized or all photos from database
async function getPhotos(resized) {
  return dbConnection.query(resized === true ? queryResizedPhoto : queryAllPhoto);
}

// upload photo and send notify to rabbitmq service
async function uploadPhoto(fields, files) {
  const record = await dbConnection.query(insertStatement, [fields.NAME, fields.WEIGHT, fields.LENGTH, fields.LATITUDE, fields.LONGITUDE, fields.USERNAME, fs.readFileSync(files.IMAGE.path)]);
  const pk = record[0].insertId;
  return sendNotify(pk);
}

module.exports = { getPhotos, uploadPhoto };
