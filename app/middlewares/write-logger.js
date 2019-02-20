const U = require('../lib/utils');

module.exports = () => {
  const Log = U.model('log');

  return async (ctx, next) => {
    await next();

    if (ctx.method === 'GET') return;

    const log = {
      params: JSON.stringify(ctx.params),
      uri: ctx.url,
      method: ctx.method
    };

    if (ctx.headers['X-Content-Resource-Status'] === 'Unchanged') return;

    if (ctx.status >= 400) return;

    log.statusCode = ctx.status;
    log.clientIp = ctx._clientIp;
    log.userId = ctx.user ? ctx.user.id : 0;
    log.response = ctx.body;

    await Log.create(log);
  };
};
