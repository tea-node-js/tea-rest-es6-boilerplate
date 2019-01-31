const assert = require('assert');
const teaRestPluginMysql = require('tea-rest-plugin-mysql');
const user = require('../app/controllers/helper/user');
const U = require('../app/lib/utils');

// mock a models
const mockModels = () => {
  const { Sequelize } = teaRestPluginMysql;

  const sequelize = new Sequelize();

  const models = {
    auth: sequelize.define('book', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
    }),
    user: sequelize.define('user', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
    }),
  };

  models.auth.readUserByToken = {
    removeKey: false,
  };

  models.auth.findOne = () => new Promise(resolve => setTimeout(resolve, 10));

  return models;
};

// mock next function
const next = async () => {};

// mock checkPassSuccess
const checkPassSuccess = u => (
  () => (
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(u);
      }, 10);
    })
  )
);

// mock addAuthSuccess
const addAuthSuccess = auth => (
  () => (
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(auth);
      }, 10);
    })
  )
);

// mock addAuthError
const addAuthError = message => (
  () => (
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(Error(message));
      }, 10);
    }) 
  )
);

// mock readUserByTokenError
const readUserByTokenError = message => (
  () => (
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(Error(message));
      }, 10);
    }) 
  )
);

/* global describe it */
describe('helper.user', () => {
  describe('#logout', () => {
    it('Auth.readUserByToken.removeKey non-exists', (done) => {
      const models = mockModels();
      const uModel = U.model;
      U.model = name => models[name];

      const ctx = {
        headers: {
          'X-Auth-Token': 'THIS IS A TEST TOKEN',
        },
        params: {},
        query: {},
        res: {
          noContent: (params) => {
            assert.equal(null, params);
            U.model = uModel;
            done();
          },
        },
      };

      const logout = user.logout();

      logout(ctx, next);
    });

    it('Auth.addAuth error', (done) => {
      const models = mockModels();
      const uModel = U.model;
      U.model = name => models[name];
      const _user = {
        id: 1,
        name: 'jason',
      };

      models.user.checkPass = checkPassSuccess(_user);
      models.auth.addAuth = addAuthError('Hello, add auth error');

      const ctx = { 
        res: {
          forbidden({ error = null, message = null }) {
            assert.deepEqual({
              code: 403,
              message: 'Hello, add auth error',
            }, error);
            assert.equal('Hello, add auth error', message);
            U.model = uModel;
            done();
          },
        },
        params: {},
        query: {},
      };

      const login = user.login();

      login(ctx);
    });

    it('Auth.readUserByToken error', (done) => {
      const models = mockModels();
      const uModel = U.model;
      U.model = name => models[name];
      const _user = {
        id: 1,
        name: 'jason',
        toJSON() {
          return { id: this.id, name: this.name };
        },
      };
      const _auth = {
        toJSON() {
          return {};
        },
      };

      models.user.checkPass = checkPassSuccess(_user);
      models.auth.addAuth = addAuthSuccess(_auth);
      models.auth.readUserByToken = readUserByTokenError('Hi, read user by token error');

      const ctx = { 
        res: {
          forbidden({ error = null, message = null }) {
            assert.deepEqual({
              code: 403,
              message: 'Hi, read user by token error',
            }, error);
            assert.equal('Hi, read user by token error', message);
            U.model = uModel;
            done();
          },
        },
        params: {},
        query: {},
      };

      const login = user.login();

      login(ctx);
    });
  });

  describe('#checkPass', () => {
    it('req.user undefined', (done) => {
      const models = mockModels();
      const uModel = U.model;
      U.model = name => models[name];

      const ctx = { 
        params: {},
        query: {},
        res: {
          notFound: ({ error = null, message = null }) => {
            assert.deepEqual({
              code: 404,
              message: 'user not found',
            }, error);
            assert.equal('user not found', message);
            U.model = uModel;
            done();
          },
        },
      };

      const checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(ctx);
    });

    it('req.user undefined, ignoreAdmin = true, modifyUser = true', (done) => {
      const models = mockModels();
      const uModel = U.model;
      U.model = name => models[name];

      const ctx = {
        params: {
          id: '998',
        },
        isAdmin: true,
        user: {
          id: 999,
        },
        query: {},
      };
      
      const checkPass = user.checkPass(['email', 'password'], true, true);

      checkPass(ctx, (error) => {
        assert.equal(null, error);
        U.model = uModel;
        done();
      });
    });
  });
});