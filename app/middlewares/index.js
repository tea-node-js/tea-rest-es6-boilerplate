const config = require("../configs");
const user = require("./user");
const privateCheck = require("./private-client-check");

module.exports = [
  privateCheck(config.proxyIps, config.privateIps),
  user(new Set(config.allowGuestAccessPaths))
];
