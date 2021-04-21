const fs = require('fs');
const { sendNotify } = require('./rabbitmq-service');
const { dbConnection } = require('./database-service');
const { queryResizedPhoto, queryAllPhoto, insertStatement } = require('../utils/query');

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
