#!/usr/bin/env node

const U = require('../app/lib/utils');

const salt = 'GVA1K8Ga5D';
const password = 'baiyu123';

const pass = U.md5(`${salt}${U.md5(password)}${salt}`);

console.log(pass);