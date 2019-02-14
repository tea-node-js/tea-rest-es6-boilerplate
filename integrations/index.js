#! /usr/bin/env node

const Restintegration = require("restintegration");
const config = require("../app/configs/config.test");
const options = require("./options");

module.exports = done => {
  const opts = options(config);
  opts.hooks.done = done;
  return new Restintegration(opts);
};
