const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');

const { getPhotos, uploadPhoto } = require('./services/photo-service');
const { validate } = require('./validator');
const { logger } = require('./utils/logger');

// START JOB
require('./job');

const app = express();
const jsonParser = bodyParser.json();

app.get('/photos', async (req, res) => {
  try {
    const [rows] = await getPhotos(false);
    res.status(200).json({
      rows,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
  return res;
});

app.get('/resized-photos', async (req, res) => {
  try {
    const [rows] = await getPhotos(true);
    res.status(200).json({
      rows,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
  return res;
});

app.post('/upload',
  jsonParser,
  async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      const valid = validate(fields, files);
      if (!valid) {
        res.status(400).json({
          success: false,
          errors: 'fields or files not valid',
        });
      } else {
        try {
          await uploadPhoto(fields, files);
          res.status(200).json({
            success: true,
            message: 'Success',
          });
        } catch (e) {
          res.status(400).json({
            error: e,
          });
        }
      }
    });
    return res;
  });

app.listen(3000);
logger.info('Server on port -> 3000');
module.exports = app;
