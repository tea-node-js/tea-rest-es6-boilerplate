#! /usr/bin/env node

const getter = require('tea-rest-helper-getter');
const assert = require('tea-rest-helper-assert');
const rest = require('tea-rest-helper-rest');
const params = require('tea-rest-helper-params');
const Redis = require('ioredis');
const Cache = require('tea-cache');
const U = require('./app/lib/utils');
const config = require('./app/configs');

const { name, host, port } = config.service;

const cache = config.cachel;
U.cache = new Cache(new Redis(cache), U._);

const env = process.env.NODE_ENV || 'development';

U.rest
  .plugin(U.teaRestPluginMysql)
  .plugin(getter, assert, rest, params)
  .plugin(() => {
    U.model = U.rest.utils.model;
  })
  .start(`${__dirname}/app`, () => {
    U.logger.info(`${name} api started ${host}:${port} in ${env} mode!`);
  });
