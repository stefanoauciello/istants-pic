const sharp = require('sharp');

const { executeQuery } = require('./database-service');

const selectFromPk = 'SELECT ID, NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, UPDATED_AT, CREATED_AT FROM instant.PHOTOS WHERE ID =';
const insertStatement = 'INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, RESIZED) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

// get photo from database, resize and save on database with resized flag true
async function resizePhoto(pk) {
  console.log(`Starting process resize photo with id -> ${pk}`);
  const [rows] = await executeQuery(`${selectFromPk} ${pk}`);
  const photo = rows[0].PHOTO;

  const photo150 = await sharp(photo)
    .resize(150, 150)
    .toBuffer();

  await executeQuery(insertStatement, [rows[0].NAME, 150, 150, rows[0].LATITUDE, rows[0].LONGITUDE, rows[0].USERNAME, photo150, true]);
  console.log(`Ended process resize photo with id -> ${pk}`);
  return true;
}

module.exports = { resizePhoto };
