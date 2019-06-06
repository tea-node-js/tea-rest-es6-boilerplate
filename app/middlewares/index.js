const config = require('../configs');
const user = require('./user');
const writeLogger = require('./write-logger');
const privateCheck = require('./private-client-check');

module.exports = [
  writeLogger(),
  privateCheck(config.proxyIps, config.privateIps),
  user(new Set(config.allowGuestAccessPaths))
];
