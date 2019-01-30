// const U = require('../../app/lib/utils');

// let enabledToken = '';
module.exports = [{
  name: '测试ID = 1的初始用户的登陆',
  uri: '/session',
  method: 'post',
  headers: {
    'X-Real-IP': '199.199.0.199',
  },
  data: {
    name: 'baiyu',
    email: '602316022@qq.com',
    password: 'baiyu123',
  },
  expects: {
    Status: 201,
  },
}];
/*
, (last) => {
  enabledToken = last.auth.token;
  return {
    name: '登陆后的token可以获取session接口',
    uri: '/session',
    headers: {
      'X-Auth-Token': enabledToken,
    },
    expects: {
      Status: 200,
      JSON: {
        id: 1,
        name: 'baiyu',
        email: '602316022@qq.com',
        role: 'admin',
        status: 'enabled',
        isDelete: 'no',
        auth: {
          token: enabledToken,
        },
      },
    },
  };
}, () => ({
  name: '测试用户退出接口，销毁刚才的 token',
  uri: '/session',
  method: 'delete',
  headers: {
    'X-Auth-Token': enabledToken,
  },
  expects: {
    Status: 204,
  },
}), () => ({
  name: '被销毁的 token 无法继续请求 session 接口',
  uri: '/session',
  headers: {
    'X-Auth-Token': enabledToken,
  },
  expects: {
    Status: 403,
    JSON: {
      code: 'NotAuthorized',
      message: 'Token error.',
    },
  },
}), {
  name: '测试用户的登陆, 密码错误',
  uri: '/session?_locale=en',
  method: 'post',
  headers: {
    'X-Real-IP': '199.199.0.199',
  },
  data: {
    email: '602316022@qq.com',
    password: '123456bc',
  },
  expects: {
    Status: 403,
    JSON: {
      code: 'NotAuthorized',
      message: 'Password or Email error.',
    },
  },
}, {
  name: '测试用户的登陆, 用户不存在',
  uri: '/session?_locale=en',
  method: 'post',
  headers: {
    'X-Real-IP': '199.199.0.199',
  },
  data: {
    email: '13740090@qq.com',
    password: '123456abc',
  },
  expects: {
    Status: 403,
    JSON: {
      code: 'NotAuthorized',
      message: 'Password or Email error.',
    },
  },
}, {
  name: '测试用户的登陆, 用户不存在',
  uri: '/session?_locale=zh',
  method: 'post',
  headers: {
    'X-Real-IP': '199.199.0.199',
  },
  data: {
    email: '13740090@qq.com',
    password: '123456abc',
  },
  expects: {
    Status: 403,
    JSON: {
      code: 'NotAuthorized',
      message: '账号或密码错误。',
    },
  },
}, {
  name: '测试用户的MOCK是否成效',
  uri: '/session',
  headers: {
    'X-Real-IP': '199.199.0.199',
    'X-Auth-Token': 'MOCK::1',
  },
  expects: {
    Status: 200,
    JSON: {
      id: 1,
      name: 'baiyu',
      email: '602316022@qq.com',
      role: 'admin',
      status: 'enabled',
      isDelete: 'no',
    },
  },
}];
*/
