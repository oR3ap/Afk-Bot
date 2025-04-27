const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../logs.txt');

function log(message) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}`;
  console.log(fullMessage);
  fs.appendFileSync(logFile, fullMessage + '\n');
}

module.exports = { log };
