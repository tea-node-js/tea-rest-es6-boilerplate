const U = require('../lib/utils');

const PRIVATEIPGUEST = Object.freeze({
  id: 0,
  name: 'Private client'
});

const GUEST = Object.freeze({
  id: 0,
  name: 'Guest'
});

/**
 * user middleware
 */
module.exports = guestAllowPaths => {
  const Auth = U.model('auth');
  const checkGuest = U._.memoize(apiPath => guestAllowPaths.has(apiPath));

  return async (ctx, next) => {
    const token = U.getToken(ctx);

    if (!token) {
      if (checkGuest(`${ctx.method} ${ctx.path}`)) {
        ctx.user = GUEST;
      }

      if (ctx.privateSwitchs) {
        ctx.user = PRIVATEIPGUEST;
      }

      if (!ctx.user) {
        const error = Error('user not authorized');
        ctx.res.unauthorized({
          error: {
            code: 401,
            message: error.message || error.stack
          },
          message: error.message || error.stack
        });
        return;
      }

      await next();
      return;
    }

    try {
      const user = await Auth.readUserByToken(token);
      ctx.user = user;
      ctx.isAdmin = user.role === 'admin';
      await next();
    } catch (error) {
      ctx.res.unauthorized({
        error: {
          code: 401,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
    }
  };
};
