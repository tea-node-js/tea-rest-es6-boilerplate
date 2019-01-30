const config = require('./base');

const { env } = process;

config.service.port = '9988';

config.db.host = env.DBHOST || '127.0.0.1';
config.db.port = env.DBPORT || '3306';
config.db.user = env.DBUSER || 'root';
config.db.pass = env.DBPASS || '12345678';
config.db.name = env.DBNAME || 'tearest_test';

module.exports = config;
