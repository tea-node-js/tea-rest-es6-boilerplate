const U = require('../lib/utils');
const helper = require('./helper');

const User = U.model('user');
const CHECK_PASS_COLS = [
  'email', 'password',
];

const login = [
  helper.user.login(),
  helper.user.session(201),
];

const logout = [
  helper.user.logout(),
];

const session = [
  helper.user.session(),
];

const list = [
  [
    helper.checker.sysAdmin(),
    helper.checker.privateSwitch('users'),
  ],
  helper.rest.list(User),
];

const modify = [
  helper.getter(User, 'user'),
  helper.assert.exists('hooks.user'),
  [
    helper.checker.ownSelf('params.id'),
    helper.checker.sysAdmin(),
  ],
  helper.user.checkPass(CHECK_PASS_COLS, true, true),
  helper.rest.modify(User, 'user'),
];

const remove = [
  helper.checker.sysAdmin(),
  helper.getter(User, 'user'),
  helper.assert.exists('hooks.user'),
  helper.rest.remove.hook('user').exec(),
];

const detail = [
  helper.getter(User, 'user'),
  helper.assert.exists('hooks.user'),
  helper.rest.detail('user'),
];

const add = [
  helper.checker.sysAdmin(),
  helper.rest.add(User),
];

module.exports = {
  login,
  logout,
  session,
  list,
  modify,
  remove,
  detail,
  add,
};
