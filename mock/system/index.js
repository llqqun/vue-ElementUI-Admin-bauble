import Mock from 'mockjs';
import { roles } from './roles';
import { deepClone } from '../../src/utils';
import { asyncRoutes, menus } from './routes.js';

const btn = ['sys:resource:add', 'sys:resource:edit', 'sys:resource:del'];
export default [
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
    response: _ => {
      return {
        code: 200,
        data: { menus: asyncRoutes, btn: btn }
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
