const U = require('../../lib/utils');

/**
 * checker 所有的方法都可能随时会调用next error
 * checker 的思路就是检测，遇到不合法的直接就返回异常
 */

/* 检测当前用户是否为管理员 */
const sysAdmin = (msg = 'user must be admin') => {
  const error = msg instanceof Error ? msg : Error(msg);
  return async (ctx, next) => {
    if (ctx.isAdmin !== true) {
      ctx.res.forbidden({
        error: {
          code: 403,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
      return;
    }

    await next();
  };
};

/*  检测资源是否属于自己 */
const ownSelf = (keyPath, allowEmpty, msg = 'user must be owner') => {
  const error = msg instanceof Error ? msg : Error(msg);
  return async (ctx, next) => {
    const id = +U._.get(ctx, keyPath) || 0;

    if (!allowEmpty && id === 0) {
      ctx.res.forbidden({
        error: {
          code: 403,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
      return;
    }

    if (ctx.user.id !== id) {
      ctx.res.forbidden({
        error: {
          code: 403,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
      return;
    }

    await next();
  };
};

/* 检测私有客户端功能 */
const privateSwitch = (name, msg = 'no private switch authorized') => {
  const error = msg instanceof Error ? msg : Error(msg);

  return async (ctx, next) => {
    /* 判断是否是私有ip客户端，并且允许私有客户端直接访问 */
    if (!ctx.allowPrivateSwitch(name)) {
      ctx.res.forbidden({
        error: {
          code: 403,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
      return;
    }
    await next();
  };
};

module.exports = {
  sysAdmin,
  ownSelf,
  privateSwitch
};
