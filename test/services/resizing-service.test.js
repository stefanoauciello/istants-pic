const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const { resizePhoto } = require('../../src/services/resizing-service');
const { getPhotos } = require('../../src/services/photo-service');

const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'instant',
  password: 'instant',
};

describe('Resizing Service', () => {
  beforeAll(async () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../assets/image.jpg'));
    const dbConnection = await mysql.createConnection(config).promise();
    await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
      ['NAME', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', rawData, '2021-03-22 11:41:19']);
  });

  afterAll(async () => {
    const dbConnection = await mysql.createConnection(config).promise();
    await dbConnection.query('TRUNCATE TABLE instant.PHOTOS;');
  });

  it('should return resized obj', async () => {
    const res = await resizePhoto(1);
    const [rows] = await getPhotos(true);
    expect(rows.length).toBe(1);
    expect(rows[0].NAME).toBe('NAME');
    expect(rows[0].WEIGHT).toBe(150);
    expect(rows[0].LENGTH).toBe(150);
  });
});
