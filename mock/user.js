import Mock from 'mockjs'

const tokens = {
  'admin': Mock.mock('@guid') + 'admin',
  'demo': Mock.mock('@guid') + 'demo'
}
const data = Mock.mock({
  'users|2': [{
    id: '@id',
    'status|1': [0, 1],
    name: '@cname',
    'roles|+1': ['admin', 'demo'],
    email: '@email',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  }]
})

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      if (!tokens[username]) {
        return {
          code: 201,
          message: '没有该用户!'
        }
      }

      return {
        code: 200,
        data: tokens[username]
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const user = data.users.filter(item => {
        return token.indexOf(item.roles) !== -1
      })
      // mock error
      if (!user.length) {
        return {
          code: 201,
          message: '没有用户信息.'
        }
      }

      return {
        code: 200,
        data: user[0]
      }
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
      }
    }
  }
]
