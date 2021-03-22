const request = require('supertest');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const app = require('../src/index');

const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'instant',
  password: 'instant',
};

describe('Endpoints', () => {
  beforeAll(async () => {
    const rawData = fs.readFileSync(path.resolve(__dirname, 'assets/image.jpg'));
    const dbConnection = await mysql.createConnection(config).promise();
    await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, PHOTO, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
      ['NAME', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', rawData, '2021-03-22 11:41:19']);
    await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, RESIZED, PHOTO, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['NAME', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', true, rawData, '2021-03-22 11:41:30']);
  });

  afterAll(async () => {
    const dbConnection = await mysql.createConnection(config).promise();
    await dbConnection.query('TRUNCATE TABLE instant.PHOTOS;');
  });

  it('should get all photos', async () => {
    const res = await request(app).get('/photos');
    expect(res.statusCode).toEqual(200);
    expect(res.body.rows.length).toBe(2);
    expect(res.body.rows[0].ID).toEqual(2);
    expect(res.body.rows[0].NAME).toEqual('NAME');
  });

  it('should get all photos resized', async () => {
    const res = await request(app).get('/resized-photos');
    expect(res.statusCode).toEqual(200);
    expect(res.body.rows.length).toBe(1);
    expect(res.body.rows[0].ID).toEqual(2);
    expect(res.body.rows[0].NAME).toEqual('NAME');
  });

  it('should upload photo', async () => {
    const res = await request(app).post('/upload').set('Content-Type', 'multipart/form-data')
      .field('NAME', 'prova')
      .field('WEIGHT', '10.5')
      .field('LENGTH', '10')
      .field('LATITUDE', 'A')
      .field('LONGITUDE', 'B')
      .field('USERNAME', 'USER1')
      .attach('IMAGE', path.resolve(__dirname, 'assets/image.jpg'));
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Success', success: true });
  });

  it('should return validation error', async () => {
    const res = await request(app).post('/upload').set('Content-Type', 'multipart/form-data')
      .field('NAME', 'prova')
      .field('WEIGHT', '10.5')
      .field('LENGTH', 'a')
      .field('LATITUDE', 'A')
      .field('LONGITUDE', 'B')
      .field('USERNAME', 'USER1')
      .attach('IMAGE', path.resolve(__dirname, 'assets/image.jpg'));
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ errors: 'fields or files not valid', success: false });
  });
});
