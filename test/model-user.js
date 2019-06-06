const assert = require('assert');
const U = require('../app/lib/utils');
const userModule = require('../app/models/user');

const { Sequelize } = U.rest;
const sequelize = new Sequelize();
const User = userModule(sequelize);

/* global describe it */
describe('model user', () => {
  describe('#Model.checkPass', () => {
    const email = 'test@test.com';
    const password = '123456';
    it('status is disabled', done => {
      User.findOne = () =>
        new Promise(resolve => {
          const user = {
            status: 'disabled',
            checkPass: value => {
              assert.equal('123456', value);
              return true;
            }
          };
          setTimeout(() => {
            resolve(user);
          }, 10);
        });
      User.checkPass(email, password).catch(error => {
        assert.ok(error instanceof Error);
        assert.equal('User had disabled.', error.message);
        done();
      });
    });

    it('isDelete is yes', done => {
      User.findOne = () =>
        new Promise(resolve => {
          const user = {
            isDelete: 'yes',
            checkPass: value => {
              assert.equal('123456', value);
              return true;
            }
          };
          setTimeout(() => {
            resolve(user);
          }, 10);
        });
      User.checkPass(email, password).catch(error => {
        assert.deepEqual(Error('User had deleted.'), error);
        done();
      });
    });
  });

  describe('#Model.avatarPath', () => {
    it('type is png', done => {
      assert.equal('users/11/870/20.png', User.avatarPath(20, 'png'));
      done();
    });
  });
});
