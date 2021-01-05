import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from '@/viewTem';

/**
 * noCompoent          为true时使得该属性路由下的子路由和本级路由平级
 *
 */

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () => import('@/views/redirect/index')
    }]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: Layout,
    redirect: '/404/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'Miss404',
      component: () => import('@/views/error/404'),
      meta: {
        title: '404'
      }
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      {
        path: 'people',
        name: 'Personal',
        component: () => import('@/views/personal/index'),
        meta: {
          title: '个人中心',
          rootPath: '/',
          icon: 'example'
        }
      }
    ]
  }
];
/* 本地异步路由暂时无用 */
export const asyncRoutes = [
  {
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: 'noRedirect',
    meta:
      {
        title: '系统管理',
        icon: 'example'
      },
    children: [
      {
        path: 'resource',
        name: 'Resource',
        component: 'system/resource',
        meta:
          {
            title: '菜单管理',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'admin',
        name: 'Admin',
        component: 'system/admin',
        hidden: 0,
        meta:
          {
            title: '用户管理',
            icon: 'example'
          }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: 'system/roles',
        meta:
          {
            title: '角色管理',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'organization',
        name: 'Organization',
        component: 'system/organization',
        meta:
          {
            title: '组织机构',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'monitoringSYS',
        noCompoent: true,
        meta: {
          title: '系统监控',
          icon: 'mentus'
        },
        children: [{
          path: 'loginRecord',
          name: 'LoginRecord',
          component: 'system/monitoring/loginRecord',
          meta: {
            title: '系统登入记录'
          }
        },
        {
          path: 'sysLog',
          name: 'SysLog',
          component: 'system/monitoring/sysLog',
          meta: {
            title: '系统操作日志'
          }
        },
        {
          path: 'serviceState',
          name: 'ServiceState',
          component: 'system/monitoring/serviceState',
          meta: {
            title: '服务器状况'
          }
        },
        {
          path: 'online',
          name: 'Online',
          component: 'system/monitoring/online',
          meta: {
            title: '在线用户'
          }
        }
        ]
      },
      {
        path: 'https://www.baidu.com',
        component: 'Layout',
        meta:
          {
            title: '百度搜索',
            icon: 'mentus'
          },
        hidden: false
      }
    ]
  },
  {
    path: '/professionalWork',
    component: 'Layout',
    hidden: 0,
    meta:
      {
        title: '业务功能',
        icon: 'example'
      },
    children: [
      {
        path: 'table',
        noCompoent: true,
        meta:
          {
            title: '表格',
            icon: 'example'
          },
        children: [
          {
            path: 'table1',
            name: 'Table1',
            component: 'professionalWork/table/table1',
            meta: {
              title: '综合表格',
              icon: ''
            }
          },
          {
            path: 'table2',
            name: 'Table2',
            component: 'professionalWork/table/table2',
            title: '复杂表格',
            meta: {
              title: '复杂表格',
              icon: ''
            }
          }
        ]
      },
      {
        path: 'components',
        noCompoent: true,
        meta:
          {
            title: '组件',
            icon: 'example'
          },
        children: [
          {
            path: 'vueCropper',
            name: 'VueCropper',
            component: 'professionalWork/components/vueCropper',
            meta: {
              title: '图片裁剪',
              icon: ''
            }
          }
        ]
      }
    ]
  },
  {
    path: '/experiment',
    component: 'Layout',
    meta:
      {
        title: '实验室',
        icon: 'example'
      },
    children: [
      {
        path: 'test',
        name: 'test',
        component: 'experiment/test',
        meta:
          {
            title: '测试',
            icon: 'example'
          }
      }
    ]
  }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
