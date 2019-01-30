const _ = require('lodash');
const home = require('./home');
const session = require('./session');

module.exports = _.flatten([
  home,
  session,
]);