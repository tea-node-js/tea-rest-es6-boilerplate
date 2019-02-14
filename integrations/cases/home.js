module.exports = [
  {
    name: "游客访问 / 提示没有权限",
    uri: "/",
    expects: {
      Status: 401,
      JSON: {
        status: "fail",
        error: {
          code: 401,
          message: "user not authorized"
        },
        message: "user not authorized"
      }
    }
  },
  {
    name: "普通用户可以访问 /",
    uri: "/",
    headers: {
      "X-Real-IP": "199.199.0.199",
      "X-Auth-Token": "MOCK::1"
    },
    expects: {
      Status: 200,
      JSON: {
        status: "success",
        message: null
      }
    }
  }
];
