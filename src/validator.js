const validator = require('validator');

function validate(fields, files) {
  let isValid = true;

  if (validator.isEmpty(fields.NAME)) {
    isValid = false;
  }

  if (validator.isEmpty(fields.WEIGHT) || !validator.isNumeric(fields.WEIGHT)) {
    isValid = false;
  }

  if (validator.isEmpty(fields.LENGTH) || !validator.isNumeric(fields.LENGTH)) {
    isValid = false;
  }

  if (validator.isEmpty(fields.LATITUDE)) {
    isValid = false;
  }

  if (validator.isEmpty(fields.LONGITUDE)) {
    isValid = false;
  }

  if (validator.isEmpty(fields.USERNAME)) {
    isValid = false;
  }

  if (files === null || files === undefined || files.IMAGE === null || files.IMAGE === undefined) {
    isValid = false;
  }

  return isValid;
}

module.exports = { validate };
