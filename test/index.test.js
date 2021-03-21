const request = require('supertest')
const app = require('./../src/index')
describe('Endpoints', () => {

    const photo1 = {
        NAME: "PHOTO1",
        WEIGHT: 10,
        LENGTH: 10,
        LATITUDE: "1O",
        LONGITUDE: "15",
        USERNAME: "USER1"
    }

    const photo2 = {
        NAME: "PHOTO2",
        WEIGHT: 10,
        LENGTH: 10,
        LATITUDE: "1O",
        LONGITUDE: "15",
        USERNAME: "USER1"
    }
    it('should create a new photo', async () => {
        const res1 = await request(app).post('/upload').send(photo1)
        expect(res1.statusCode).toEqual(200)
        expect(res1.body).toEqual({"message": "Success", "success": true})
        const res2 = await request(app).post('/upload').send(photo2)
        expect(res2.statusCode).toEqual(200)
        expect(res2.body).toEqual({"message": "Success", "success": true})
    })
    it('should get all photos', async () => {
        const res = await request(app).get('/photos')
        expect(res.statusCode).toEqual(200)
        expect(res.body.rows[0].ID).toEqual(1)
        expect(res.body.rows[0].NAME).toEqual("PHOTO1")
        expect(res.body.rows[1].ID).toEqual(2)
        expect(res.body.rows[1].NAME).toEqual("PHOTO2")
    })
})