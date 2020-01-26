#!/usr/bin/env node

const { exec } = require('child_process');
const Redis = require('ioredis');
const Cache = require('tea-cache');
const U = require('../app/lib/utils');
const config = require('../app/configs/config.test');

const strfile = `${__dirname}/../app/configs/table.sql`;
const datafile = `${__dirname}/../app/configs/test-data.sql`;
const db = config.db || {};
const cache = config.cache || {};

const redis = new Redis(cache);

U.cache = new Cache(redis, U._);

const asyncExec = U.util.promisify(exec);

const initRedis = async () => {
  await U.cache.del('*');
};

const initMysql = async () => {
  let mysqlAuth = `mysql -h${db.host} -u${db.user} -P ${db.port}`;

  if (db.pass) mysqlAuth += ` -p'${db.pass}'`;

  const command = [
    `${mysqlAuth} ${db.name} < ${strfile}`,
    `${mysqlAuth} ${db.name} < ${datafile}`
  ].join('\n');

  await asyncExec(command);
};

const task = async () => {
  await initRedis();
  await initMysql();
};

const main = async cb => {
  try {
    await task();
    cb();
  } catch (err) {
    cb(err);
  }
};

const exit = error => {
  if (error) {
    console.error(error);
    process.exit(-1);
    return;
  }

  process.exit(0);
};

main(exit);
