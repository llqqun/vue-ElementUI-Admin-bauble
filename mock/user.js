import Mock from 'mockjs';

const tokens = {
  'admin': Mock.mock('@guid') + 'admin',
  'demo': Mock.mock('@guid') + 'demo'
};
const data = Mock.mock({
  'users|2': [{
    id: '@id',
    'status|1': [0, 1],
    name: '@cname',
    'roles|+1': ['admin', 'demo'],
    email: '@email',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }]
});

export default [
  // user login
  {
    url: '/api/system/login',
    type: 'post',
    response: config => {
      const { username } = config.body;
      if (!tokens[username]) {
        return {
          code: 201,
          message: '没有该用户!'
        };
      }

      return {
        code: 200,
        data: tokens[username]
      };
    }
  },

  // get user info
  {
    url: '/api/user/inform',
    type: 'get',
    response: config => {
      const { token } = config.query;
      if (!token) {
        return {
          code: 201,
          message: '没有用户信息'
        };
      }
      if (token.indexOf('demo') !== -1) {
        return {
          code: 200,
          data: data.users[1]
        };
      }
      data.users[0]['token'] = token;
      return {
        code: 200,
        data: data.users[0]
      };
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: '退出成功'
      };
    }
  }
];
