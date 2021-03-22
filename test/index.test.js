const request = require('supertest');
const mysql = require('mysql2');
const app = require('../src/index');

const config = {
  host: '127.0.0.1',
  port: 3306,
  user: 'instant',
  password: 'instant',
};

describe('Endpoints', () => {
  beforeAll(async () => {
    const dbConnection = await mysql.createConnection(config).promise();
    await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?)',
      ['NAME', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', '2021-03-22 11:41:19']);
    await dbConnection.query('INSERT INTO instant.PHOTOS (NAME, WEIGHT, LENGTH, LATITUDE, LONGITUDE, USERNAME, RESIZED, CREATED_AT) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
      ['NAME', 'WEIGHT', 'LENGTH', 'LATITUDE', 'LONGITUDE', 'USERNAME', true, '2021-03-22 11:41:30']);
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
});
