const assert = require('assert');
const teaRestPluginMysql = require('tea-rest-plugin-mysql');
const U = require('../app/lib/utils');
const middle = require('../app/middlewares/user');

/* global describe it */
describe('middle user', () => {
  describe('#noraml', () => {
    it('ctx.privateSwitchs undefined', done => {
      U.model = teaRestPluginMysql(U.rest);

      const ctx = {
        headers: {
          'x-auth-token': undefined
        },
        req: {
          connection: {
            remoteAddress: '192.168.199.188'
          }
        },
        privateSwitchs: undefined,
        params: {},
        method: 'GET',
        route: {
          path: '/users/:id'
        },
        query: {},
        res: {
          unauthorized: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 401,
                message: 'user not authorized'
              },
              error
            );
            assert.equal('user not authorized', message);
            done();
          }
        }
      };

      const allowGuestAccessPaths = ['GET /users'];

      middle(new Set(allowGuestAccessPaths))(ctx);
    });

    it('ctx.privateSwitchs defined', done => {
      const ctx = {
        headers: {
          'x-auth-token': undefined
        },
        req: {
          connection: {
            remoteAddress: '192.168.199.188'
          }
        },
        privateSwitchs: ['users'],
        params: {},
        query: {},
        method: 'GET',
        route: {
          path: '/users/:id'
        }
      };

      const allowGuestAccessPaths = ['GET /users'];

      middle(new Set(allowGuestAccessPaths))(ctx, () => {
        assert.deepEqual(
          {
            id: 0,
            name: 'Private client'
          },
          ctx.user
        );

        done();
      });
    });
  });
});
