import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from '@/layout';

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
    component: Layout,
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
        component: () => import('@/views/system/resource'),
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
        component: () => import('@/views/system/admin'),
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
        component: () => import('@/views/system/roles'),
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
        component: () => import('@/views/system/organization'),
        meta:
          {
            title: '组织机构',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'loginRecord',
        name: 'LoginRecord',
        component: () => import('@/views/system/monitoring/loginRecord'),
        meta: {
          title: '系统登入记录'
        }
      },
      {
        path: 'sysLog',
        name: 'SysLog',
        component: () => import('@/views/system/monitoring/sysLog'),
        meta: {
          title: '系统操作日志'
        }
      },
      {
        path: 'serviceState',
        name: 'ServiceState',
        component: () => import('@/views/system/monitoring/serviceState'),
        meta: {
          title: '服务器状况'
        }
      },
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/system/monitoring/online'),
        meta: {
          title: '在线用户'
        }
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: () => import('@/views/system/dictionary'),
        meta: {
          title: '数据字典'
        }
      },
      {
        path: 'configuration',
        name: 'Configuration',
        component: () => import('@/views/system/configuration'),
        meta: {
          title: '系统配置'
        }
      }
    ]
  },
  {
    path: '/professionalWork',
    component: Layout,
    hidden: 0,
    meta:
      {
        title: '功能模块',
        icon: 'example'
      },
    children: [
      {
        path: 'vueCropper',
        name: 'VueCropper',
        component: () => import('@/views/professionalWork/components/vueCropper'),
        meta: {
          title: '图片裁剪',
          icon: ''
        }
      },
      {
        path: 'tinymce',
        name: 'TinymceDemo',
        component: () => import('@/views/professionalWork/components/tinymceDemo'),
        meta: {
          title: '富文本',
          icon: ''
        }
      },
      {
        path: 'table1',
        name: 'Table1',
        component: () => import('@/views/professionalWork/table/table1'),
        meta: {
          title: '表格1',
          icon: ''
        }
      },
      {
        path: 'table2',
        name: 'Table2',
        component: () => import('@/views/professionalWork/table/table2'),
        meta: {
          title: '表格2',
          icon: ''
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
