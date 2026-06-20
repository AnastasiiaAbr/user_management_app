const { v4: uuidv4 } = require('uuid');

function getUIdValue() {
  return uuidv4();
};

module.exports = getUIdValue;