const assert = require("assert");
const checker = require("../app/controllers/helper/checker");

/* global describe it */
describe("helper.checker", () => {
  describe("#sysAdmin", () => {
    it("未指定错误", done => {
      const ctx = {
        query: {},
        params: {},
        isAdmin: false,
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "user must be admin"
              },
              error
            );
            assert.equal("user must be admin", message);
          }
        }
      };

      const check = checker.sysAdmin();
      check(ctx);

      ctx.isAdmin = true;
      check(ctx, () => {
        done();
      });
    });

    it("指定错误", done => {
      const ctx = {
        query: {},
        params: {},
        isAdmin: false,
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "您不是管理员，不能执行该操作"
              },
              error
            );
            assert.equal("您不是管理员，不能执行该操作", message);
          }
        }
      };

      const check = checker.sysAdmin("您不是管理员，不能执行该操作");
      check(ctx);

      ctx.isAdmin = true;
      check(ctx, () => {
        done();
      });
    });
  });

  describe("#ownSelf", () => {
    it("未指定错误, allowEmpty = false", done => {
      const ctx = {
        params: {
          userId: "88"
        },
        user: { id: 78 },
        query: {},
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "user must be owner"
              },
              error
            );
            assert.equal("user must be owner", message);
            done();
          }
        }
      };
      const ownSelf = checker.ownSelf("params.userId", false);
      ownSelf(ctx);
    });

    it("指定错误, allowEmpty = false", done => {
      const ctx = {
        params: {
          userId: "88"
        },
        user: { id: 78 },
        query: {},
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "不是您的资源，不能执行该操作"
              },
              error
            );
            assert.equal("不是您的资源，不能执行该操作", message);
            done();
          }
        }
      };

      const ownSelf = checker.ownSelf(
        "params.userId",
        false,
        "不是您的资源，不能执行该操作"
      );

      ownSelf(ctx);
    });

    it("未指定错误, allowEmpty = true", done => {
      const ctx = {
        params: {
          userId: 88
        },
        user: { id: 78 },
        query: {},
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "user must be owner"
              },
              error
            );
            assert.equal("user must be owner", message);
            done();
          }
        }
      };
      const ownSelf = checker.ownSelf("params.userId", true);
      ownSelf(ctx);
    });

    it("指定错误, allowEmpty = true", done => {
      const ctx = {
        params: {
          userId: 88
        },
        user: { id: 78 },
        query: {},
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "不是您的资源，不能执行该操作"
              },
              error
            );
            assert.equal("不是您的资源，不能执行该操作", message);
            done();
          }
        }
      };
      const ownSelf = checker.ownSelf(
        "params.userId",
        true,
        "不是您的资源，不能执行该操作"
      );
      ownSelf(ctx);
    });

    it("allowEmpty = true", done => {
      const ctx = {
        params: {
          userId: 0
        },
        user: { id: 0 },
        query: {}
      };
      const ownSelf = checker.ownSelf("params.userId", true);
      ownSelf(ctx, () => {
        done();
      });
    });
  });

  describe("#privateSwitch", () => {
    it("未指定错误", done => {
      const ctx = {
        allowPrivateSwitch() {
          return false;
        },
        params: {},
        query: {},
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "no private switch authorized"
              },
              error
            );
            assert.equal("no private switch authorized", message);

            done();
          }
        }
      };

      const privateSwitch = checker.privateSwitch("users");

      privateSwitch(ctx);
    });

    it("指定错误", done => {
      const ctx = {
        allowPrivateSwitch() {
          return false;
        },
        params: {},
        query: {},
        res: {
          forbidden: ({ error = null, message = null }) => {
            assert.deepEqual(
              {
                code: 403,
                message: "您没有得到私有客户端授权，不能执行该操作"
              },
              error
            );
            assert.equal("您没有得到私有客户端授权，不能执行该操作", message);

            done();
          }
        }
      };

      const privateSwitch = checker.privateSwitch(
        "users",
        "您没有得到私有客户端授权，不能执行该操作"
      );

      privateSwitch(ctx);
    });

    it("成功通过", done => {
      const ctx = {
        allowPrivateSwitch() {
          return true;
        },
        params: {},
        query: {}
      };

      const privateSwitch = checker.privateSwitch("users");

      privateSwitch(ctx, () => {
        done();
      });
    });
  });
});
