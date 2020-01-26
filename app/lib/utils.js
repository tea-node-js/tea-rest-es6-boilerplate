const util = require('util');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const async = require('async');
const rest = require('tea-rest');
const TeaCache = require('tea-cache');
const md5 = require('md5');
const teaRestPluginMysql = require('tea-rest-plugin-mysql');

const U = {};

U.rest = rest;
U._ = _;
U.TeaCache = TeaCache;
U.md5 = md5;
U.moment = moment;
U.async = async;
U.path = path;
U.fs = fs;
U.util = util;
U.teaRestPluginMysql = teaRestPluginMysql;

const utils = Object.assign(
  {},
  U.rest.utils,
  {
    model: U.rest.model,
    /**
     * 将私有ip和权限组的对应关系合并之后转换成需要的格式
     * "xxx.xxx.xxx.xxx": [Array] switchs
     */
    privateIpMerge: (switchs, obj) => {
      const ret = {};
      U._.each(obj, (ips, key) => {
        /**
         * 全部功能的暂时先跳过，后续单独处理
         *  因为担心其被其他的权限覆盖
         */
        if (key === '*') return;
        for (const ip of ips) {
          ret[ip] = ret[ip] ? ret[ip].concat(switchs[key]) : switchs[key];
        }
      });
      U._.each(ret, (v, k) => {
        ret[k] = U._.uniq(v);
      });
      if (obj['*']) {
        for (const ip of obj['*']) {
          ret[ip] = '*';
        }
      }
      return ret;
    },
    /** 解码base64的图片 */
    decodeBase64Image: dataString => {
      if (!dataString) return null;
      const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches) return null;
      return {
        type: matches[1],
        data: Buffer.from(matches[2], 'base64')
      };
    },
    mkdirp: dir => {
      if (U.fs.existsSync(dir)) return null;
      const parent = U.path.dirname(dir);
      if (!U.fs.existsSync(parent)) utils.mkdirp(parent);
      return U.fs.mkdirSync(dir);
    }
  },
  U
);

module.exports = utils;
