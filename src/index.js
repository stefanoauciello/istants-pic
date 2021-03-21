const express = require('express');
const bodyParser = require('body-parser');
const { getPhotos, uploadPhoto } = require("./photo-service");
const {body, validationResult} = require('express-validator');
const app = express();

const jsonParser = bodyParser.json()

app.get('/photos', async (req, res) => {
    return getPhotos(req, res)
})

app.post('/upload',
    jsonParser,
    body("NAME").notEmpty().isString(),
    body("WEIGHT").notEmpty().isNumeric(),
    body("LENGTH").notEmpty().isNumeric(),
    body("LATITUDE").notEmpty().isString(),
    body("LONGITUDE").notEmpty().isString(),
    body("USERNAME").notEmpty().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        return uploadPhoto(req, res);
    });

app.listen(3000)
console.log("listening at 3000")

module.exports = app;