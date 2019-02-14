const assert = require('assert');
const home = require('../app/controllers/home');

/* global describe it */
describe('controllers home', () => {
  describe('#index', () => {
    it('ctx.user', done => {
      const ctx = {
        user: {
          id: 1,
          name: 'baiyu'
        },
        _clientIp: '192.168.199.188',
        _realIp: '192.168.199.199',
        _remoteIp: '127.0.0.1',
        privateSwitchs: '*',
        res: {
          ok: ({ data = null }) => {
            const [hi, apis] = data;
            assert.ok(hi.indexOf('Hello') > -1);
            assert.deepEqual(['GET /users'], apis);
            done();
          }
        }
      };

      home.index(ctx, () => {
        done();
      });
    });

    it('Guest', done => {
      const ctx = {
        user: {
          id: 0
        },
        _clientIp: '192.168.199.188',
        _realIp: '192.168.199.199',
        _remoteIp: '127.0.0.1',
        privateSwitchs: ['users'],
        res: {
          ok: ({ data = null }) => {
            const [hi, apis] = data;
            assert.ok(hi.indexOf('Hello') > -1);
            assert.deepEqual(['GET /users'], apis);
            done();
          }
        }
      };

      home.index(ctx, () => {
        done();
      });
    });
  });
});
