const Mock = require('mockjs');
const roles = require('./roles');
const { deepClone } = require('../utils');
const { adminRoutes, demoRoutes, menus } = require('./routes.js');
const adminList = require('./admin');

const btn = ['sys:resource:add', 'sys:resource:edit', 'sys:resource:del', 'pro:table:edit'];
module.exports = [
  { // 不清楚是mock服务器错误,还是怎么滴,没有将该请求加入响应队列
    url: '/mock/code',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          code: '111',
          image: ''
          // image: Mock.Random.dataImage('60x40', Mock.mock({ 'regexp': /\w{4}/ }).regexp)
        }
      };
    }
  },
  {
    url: '/resource/list',
    type: 'get',
    response: config => {
      return {
        code: 0,
        data: {
          list: adminRoutes,
          total: 90
        }
      };
    }
  },
  {
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          list: roles,
          total: 90
        }
      };
    }
  },
  {
    url: '/menus',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: { menus: menus }
      };
    }
  },
  {
    url: '/api/routes',
    type: 'get',
    response: config => {
      const { data } = config.query;
      if (data.indexOf('demo') !== -1) {
        return {
          code: 0,
          data: { menus: demoRoutes, btn: btn }
        };
      }
      return {
        code: 0,
        data: { menus: adminRoutes, btn: btn }
      };
    }
  },
  {
    url: '/admin/list',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: { records: adminList, total: 2 }
      };
    }
  },
  {
    url: '/resource/tree',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: menus
      };
    }
  }
];
