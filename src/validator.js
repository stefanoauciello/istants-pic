const validator = require('validator');

// validate input from post
function validate(fields, files) {
  let isValid = true;

  if (fields.NAME === null || validator.isEmpty(fields.NAME)) {
    isValid = false;
  }

  if (fields.WEIGHT === null || validator.isEmpty(fields.WEIGHT) || !validator.isNumeric(fields.WEIGHT)) {
    isValid = false;
  }

  if (fields.LENGTH === null || validator.isEmpty(fields.LENGTH) || !validator.isNumeric(fields.LENGTH)) {
    isValid = false;
  }

  if (fields.LATITUDE === null || validator.isEmpty(fields.LATITUDE)) {
    isValid = false;
  }

  if (fields.LONGITUDE === null || validator.isEmpty(fields.LONGITUDE)) {
    isValid = false;
  }

  if (fields.USERNAME === null || validator.isEmpty(fields.USERNAME)) {
    isValid = false;
  }

  if (files === null || files === undefined || files.IMAGE === null || files.IMAGE === undefined) {
    isValid = false;
  }

  return isValid;
}

module.exports = { validate };
