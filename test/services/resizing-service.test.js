const fs = require('fs');
const path = require('path');
const { resizePhoto } = require('../../src/services/resizing-service');
const { getPhotos } = require('../../src/services/photo-service');
const { dbConnection } = require('../../src/services/database-service');

const insert1 = 'INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
const truncate = 'TRUNCATE TABLE instant.PHOTOS;';

describe('Resizing Service', () => {
  beforeAll(async () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../assets/image.jpg'));
    await dbConnection.query(insert1, ['NAME', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', rawData, '2021-03-22 11:41:19']);
  });

  afterAll(async () => {
    await dbConnection.query(truncate);
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
