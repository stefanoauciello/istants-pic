const fs = require('fs');
const path = require('path');
const { getPhotos, uploadPhoto } = require('../../src/services/photo-service');
const { dbConnection } = require('../../src/services/database-service');

const insert1 = 'INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
const insert2 = 'INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, RESIZED, PHOTO, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
const truncate = 'TRUNCATE TABLE instant.PHOTOS;';

describe('Photo Service Get', () => {
  beforeAll(async () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../assets/image.jpg'));
    await dbConnection.query(insert1, ['NOT-RESIZED', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', rawData, '2021-03-22 11:41:19']);
    await dbConnection.query(insert2, ['RESIZED', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', true, rawData, '2021-03-22 11:41:30']);
  });

  afterAll(async () => {
    await dbConnection.query(truncate);
  });

  it('should return resized obj', async () => {
    const [rows] = await getPhotos(true);
    expect(rows.length).toBe(1);
    expect(rows[0].NAME).toBe('RESIZED');
  });

  it('should return all objs', async () => {
    const [rows] = await getPhotos(false);
    expect(rows.length).toBe(2);
    expect(rows[0].NAME).toBe('RESIZED');
    expect(rows[1].NAME).toBe('NOT-RESIZED');
  });

});

describe('Photo Service Put', () => {
  afterAll(async () => {
    await dbConnection.query(truncate);
  });
  it('should upload image', async () => {
    const fields = {
      NAME: 'inserted',
      WEIGHT: 10,
      LENGTH: 10,
      LATITUDE: 10,
      LONGITUDE: '10',
      USERNAME: 'USER',
    };
    const files = {
      IMAGE: {
        path: path.resolve(__dirname, '../assets/image.jpg'),
      },
    };
    await uploadPhoto(fields, files);
    const [rows] = await getPhotos(false);
    expect(rows.length).toBe(1);
    expect(rows[0].NAME).toBe('inserted');
  });
});