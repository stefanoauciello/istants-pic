const express = require('express');
const bodyParser = require('body-parser');
const {getPhotos, uploadPhoto} = require("./services/photo-service");
const {validate} = require("./validator");
const formidable = require('formidable');

// START JOB
require("./job");

const app = express();

const jsonParser = bodyParser.json()

app.get('/photos', async (req, res) => {
    try {
        const [rows] = await getPhotos(false);
        res.status(200).json({
            rows: rows
        })
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
})


app.get('/resized-photos', async (req, res) => {
    try {
        const [rows] = await getPhotos(true);
        res.status(200).json({
            rows: rows
        })
    } catch (e) {
        res.status(400).json({
            error: e
        })
    }
})

app.post('/upload',
    jsonParser,
    async (req, res) => {
        const form = formidable({multiples: true});
        form.parse(req, async (err, fields, files) => {
            const valid = validate(fields, files);
            if (!valid) {
                return res.status(400).json({
                    success: false,
                    errors: "fields or files not valid"
                });
            } else {
                try {
                    await uploadPhoto(fields, files);
                    res.status(200).json({
                        success: true,
                        message: 'Success',
                    })
                } catch (e) {
                    res.status(400).json({
                        error: e
                    })
                }

            }
        });
    });

app.listen(3000);
console.log("Server on port -> 3000");

module.exports = app;