const Mock = require('mockjs');

module.exports = [
  {
    url: '/api/model/login',
    type: 'post',
    response: config => {
      return {
        code: 0,
        data: {}
      };
    }
  }
]
