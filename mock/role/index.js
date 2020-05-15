import Mock from 'mockjs';
import { deepClone } from '../../src/utils';
import { asyncRoutes } from './routes.js';

const routes = deepClone([...asyncRoutes]);
const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'demo',
    name: 'demo',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
];
const btn = ['ent:system:edit', 'ent:system:del', 'ent:system:add', 'ent:system:batchDel'];

export default [
  // mock get all routes form server
  {
    url: '/menus/routes',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: { menus: routes, btn: btn }
      };
    }
  },

  // mock get all roles form server
  {
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 200,
        data: roles
      };
    }
  },

  // add role
  {
    url: '/role',
    type: 'post',
    response: {
      code: 200,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 200,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 200,
      data: {
        status: 'success'
      }
    }
  }
];
