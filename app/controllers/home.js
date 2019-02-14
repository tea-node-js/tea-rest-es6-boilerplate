const U = require('../lib/utils');
const config = require('../configs');

const sayHi = (name, service, ip, now) =>
  `Hello ${name}, This is ${service}, Your ip: ${ip}, Now: ${now}.`;

console.log('abc');

const index = async ctx => {
  const userName = ctx.user.name || ctx.user.username || 'guest';

  const ip = [ctx._clientIp, ctx._realIp, ctx._remoteIp].join(' - ');

  const service = config.service.name;

  const hi = sayHi(userName, service, ip, new Date());

  const switchs = ctx.privateSwitchs;

  if (switchs) {
    const apis = U._.chain(config.privateSwitchs)
      .filter((x, k) => (switchs === '*' || switchs.includes(k)) && x)
      .compact()
      .flatten()
      .value();
    ctx.res.ok({
      data: [hi, apis]
    });
  } else {
    ctx.res.ok({
      data: [hi]
    });
  }
};

module.exports = { index };
