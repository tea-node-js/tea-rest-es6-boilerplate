const assert = require('assert');
const middle = require('../app/middlewares/private-client-check');

/* global describe it */
describe('middle private-cient-check', () => {
  describe('#noraml', () => {
    it('token exists', done => {
      const ctx = {
        headers: {
          'x-auth-token': 'Test token'
        },
        req: {
          connection: {
            remoteAddress: '192.168.199.188'
          }
        },
        params: {}
      };

      const proxyIps = ['127.0.0.1'];

      const privateIps = {
        '192.168.199.188': ['users']
      };

      middle(proxyIps, privateIps)(ctx, () => {
        assert.equal(false, ctx.allowPrivateSwitch('users'));
        done();
      });
    });

    it('token non-exists', done => {
      const ctx = {
        headers: {},
        req: {
          connection: {
            remoteAddress: '192.168.199.188'
          }
        },
        params: {},
        query: {}
      };

      const proxyIps = ['127.0.0.1'];

      const privateIps = {
        '192.168.199.188': ['users']
      };

      middle(proxyIps, privateIps)(ctx, () => {
        assert.equal(true, ctx.allowPrivateSwitch('users'));
        assert.equal(false, ctx.allowPrivateSwitch('user'));
        done();
      });
    });

    it('token non-exists, switchs unset', done => {
      const ctx = {
        headers: {},
        req: {
          connection: {
            remoteAddress: '192.168.199.188'
          }
        },
        params: {},
        query: {}
      };

      const proxyIps = ['127.0.0.1'];

      const privateIps = {
        '192.168.199.188': undefined
      };

      middle(proxyIps, privateIps)(ctx, () => {
        assert.equal(false, ctx.allowPrivateSwitch('users'));
        assert.equal(false, ctx.allowPrivateSwitch('user'));
        assert.equal(false, ctx.allowPrivateSwitch(''));
        assert.equal(false, ctx.allowPrivateSwitch(0));
        assert.equal(false, ctx.allowPrivateSwitch(undefined));
        assert.equal(false, ctx.allowPrivateSwitch(null));
        done();
      });
    });

    it('token non-exists, switchs *', done => {
      const ctx = {
        headers: {},
        req: {
          connection: {
            remoteAddress: '192.168.199.188'
          }
        },
        params: {},
        query: {}
      };

      const proxyIps = ['127.0.0.1'];

      const privateIps = {
        '192.168.199.188': '*'
      };

      middle(proxyIps, privateIps)(ctx, () => {
        assert.equal(true, ctx.allowPrivateSwitch('users'));
        assert.equal(true, ctx.allowPrivateSwitch('user'));
        assert.equal(false, ctx.allowPrivateSwitch(''));
        assert.equal(false, ctx.allowPrivateSwitch(0));
        assert.equal(false, ctx.allowPrivateSwitch(undefined));
        assert.equal(false, ctx.allowPrivateSwitch(null));

        done();
      });
    });
  });
});
