const assert = require('assert');
const integrations = require('../integrations');

require('../');

/* global describe it */
describe('apitest', () => {
  describe('#run api test case', () => {
    const stats = {};
    integrations(s => Object.assign(stats, s));

    it('测试运行完成后的测试用例统计信息', (done) => {
      assert.deepEqual({
        tests: 3,
        assertions: 9,
        failures: 0,
        skipped: 0,
      }, stats);

      done();
    });
  });
});