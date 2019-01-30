/* eslint import/no-dynamic-require: 0 */
module.exports = require(`./config.${process.env.NODE_ENV || 'development'}`);
