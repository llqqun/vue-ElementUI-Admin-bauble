const Mock = require('mockjs');
const roles = require('./roles');
const { deepClone } = require('../utils');
const { adminRoutes, demoRoutes, menus } = require('./routes.js');
const adminList = require('./admin');

const btn = ['sys:resource:add', 'sys:resource:edit', 'sys:resource:del', 'pro:table:edit'];
module.exports = [
  {
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 200,
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
        code: 200,
        data: { menus: menus }
      };
    }
  },
  {
    url: '/routes',
    type: 'get',
    response: config => {
      const { data } = config.query;
      if (data.indexOf('demo') !== -1) {
        return {
          code: 200,
          data: { menus: demoRoutes, btn: btn }
        };
      }
      return {
        code: 200,
        data: { menus: adminRoutes, btn: btn }
      };
    }
  },
  {
    url: '/admin/list',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: { records: adminList, total: 2 }
      };
    }
  },
  {
    url: '/resource/tree',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: menus
      };
    }
  }
];
