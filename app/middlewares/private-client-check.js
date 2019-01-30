const U = require('../lib/utils');

/** 直接拒绝 */
const noAllow = () => false;

/** 根据开关判断 */
const checker = switchs => (
  (name) => {
    if (!switchs) return false;
    if (!name) return false;
    /** 星号通配所有允许的接口 */
    if (switchs === '*') return true;
    return switchs.includes(name);
  }
);

module.exports = (proxyIps, privateIps) => (
  async (ctx, next) => {
    ctx._remoteIp = U.remoteIp(ctx);
    ctx._clientIp = U.clientIp(ctx);
    ctx._realIp = U.realIp(ctx, proxyIps);
    if (U.getToken(ctx)) {
      ctx.allowPrivateSwitch = noAllow;
    } else {
      ctx.privateSwitchs = privateIps[ctx._realIp];
      ctx.allowPrivateSwitch = checker(ctx.privateSwitchs);
    }
    await next();
  }
);