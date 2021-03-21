const express = require('express');
const bodyParser = require('body-parser');
const { getPhotos, uploadPhoto } = require("./services/photo-service");
const { validate } = require("./validator");
const formidable = require('formidable');

// START JOB
require("./job");

const app = express();

const jsonParser = bodyParser.json()

app.get('/photos', async (req, res) => {
    return getPhotos(req, res)
})

app.post('/upload',
    jsonParser,
    async (req, res) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            const valid = validate(fields, files);
            if(!valid){
                return res.status(400).json({
                    success: false,
                    errors: "fields or files not valid"
                });
            } else {
                return uploadPhoto(fields, files, res);
            }
        });
    });

app.listen(3000);
console.log("Server on port -> 3000");

module.exports = app;