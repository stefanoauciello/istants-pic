const express = require('express');
var CronJob = require('cron').CronJob;
const bodyParser = require('body-parser');
const { getPhotos, uploadPhoto, do_consume } = require("./photo-service");
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

const job = new CronJob("*/1 * * * * *", function() {
    console.log("running a task every 1 second");
    do_consume();
});
job.start();

app.listen(3000);
console.log("listening at 3000");

module.exports = app;