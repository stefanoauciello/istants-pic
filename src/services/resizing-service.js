const sharp = require('sharp');
const { dbConnection } = require('./database-service');
const { logger } = require('../utils/logger');
const { selectFromPk, insertStatementWithResize } = require('../utils/query');

// get photo from database, resize and save on database with resized flag true
async function resizePhoto(pk) {
  logger.info(`Starting process resize photo with id -> ${pk}`);
  const [rows] = await dbConnection.query(`${selectFromPk} ${pk}`);
  const photo = rows[0].PHOTO;
  const photo150 = await sharp(photo).resize(150, 150).toBuffer();
  await dbConnection.query(insertStatementWithResize, [rows[0].NAME, 150, 150, rows[0].LATITUDE, rows[0].LONGITUDE, rows[0].USERNAME, photo150, true]);
  logger.info(`Ended process resize photo with id -> ${pk}`);
  return true;
}

module.exports = { resizePhoto };
