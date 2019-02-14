const U = require("../../lib/utils");

/** 读取session */
const session = (statusCode = 200) => async (ctx, next) => {
  ctx.res.success({
    data: ctx.user,
    statusCode
  });
  await next();
};

/** 登陆 */
const login = () => {
  const User = U.model("user");
  const Auth = U.model("auth");
  return async (ctx, next) => {
    const { email, password } = ctx.params;
    try {
      const user = await User.checkPass(email, password);
      const auth = await Auth.addAuth(user, ctx._realIp);
      const json = user.toJSON();
      json.auth = auth.toJSON();
      await Auth.readUserByToken(auth.token);
      ctx.user = json;
      await next();
    } catch (error) {
      ctx.res.forbidden({
        error: {
          code: 403,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
    }
  };
};

/* 退出 */
const logout = () => {
  const Auth = U.model("auth");

  return async (ctx, next) => {
    const token = U.getToken(ctx);

    try {
      const auth = await Auth.findOne({ where: { token } });

      if (auth) {
        await auth.destroy();
      }

      ctx.res.noContent();

      await next();
    } catch (error) {
      ctx.res.sequelizeIfError(error);
    }
  };
};

const checkPass = (cols, ignoreAdmin, modifyUser) => {
  const User = U.model("user");

  return async (ctx, next) => {
    const { user } = ctx;
    const { origPass } = ctx.params;
    if (!user) {
      const error = Error("user not found");
      ctx.res.notFound({
        error: {
          code: 404,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
      return;
    }
    if (ignoreAdmin && ctx.isAdmin === true) {
      if (!(modifyUser && ctx.user.id === +ctx.params.id)) {
        await next();
        return;
      }
    }
    /** 判断如果没有必要的字段修改则不进行验证 */
    const dangers = U._.filter(cols, x => U.hasOwnProperty.call(ctx.params, x));
    if (!dangers.length) {
      await next();
      return;
    }

    if (!origPass) {
      const error = Error("no original pass");
      ctx.res.unauthorized({
        error: {
          code: 401,
          message: error.message || error.stack
        },
        message: error.message || error.stack
      });
      return;
    }

    try {
      await User.checkPass(user.email, origPass);
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

module.exports = {
  login,
  logout,
  session,
  checkPass
};
