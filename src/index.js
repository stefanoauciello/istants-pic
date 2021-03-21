const express = require('express');
const CronJob = require('cron').CronJob;
const bodyParser = require('body-parser');
const { getPhotos, uploadPhoto } = require("./services/photo-service");
const { doConsume } = require("./services/rabbitmq-service");
const { validate } = require("./validator");
const formidable = require('formidable');
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

const job = new CronJob("*/1 * * * * *", async () => {
    await doConsume();
});
job.start();

app.listen(3000);
console.log("Server on port -> 3000");

module.exports = app;