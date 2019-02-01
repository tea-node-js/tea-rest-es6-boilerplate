#! /usr/bin/env node

const getter = require('tea-rest-helper-getter');
const assert = require('tea-rest-helper-assert');
const rest = require('tea-rest-helper-rest');
const params = require('tea-rest-helper-params');
const U = require('./app/lib/utils');
const config = require('./app/configs');

const { service } = config;
const { name, host, port } = service;

const cache = config.cache || {};
U.cached.init(cache.port, cache.host, cache.opts);

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
