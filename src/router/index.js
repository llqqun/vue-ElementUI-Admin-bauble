import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';
import ViewTem from '@/viewTem';

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
    component: ViewTem,
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

export const asyncRoutes = [
  {
    path: '/system',
    component: ViewTem,
    meta: {
      title: '系统管理',
      hidden: true,
      icon: 'example'
    },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/system/admin'),
        meta: {
          title: '管理员管理'
        }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: () => import('@/views/system/resource'),
        meta: {
          title: '资源管理'
        }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/system/roles'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'configuration',
        name: 'Configuration',
        component: () => import('@/views/system/configuration'),
        meta: {
          title: '系统配置'
        }
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/system/organization/index'),
        meta: {
          title: '组织机构'
        }
      },
      {
        path: 'depPost',
        name: 'DepPost',
        component: () => import('@/views/system/DepPost'),
        meta: {
          title: '部门职位'
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
        path: 'timeOut',
        name: 'TimeOut',
        noCompoent: true,
        component: () => import('@/views/system/timeOut'),
        meta: {
          title: '定时任务'
        }
      },
      {
        path: 'taskLog',
        name: 'TaskLog',
        component: () => import('@/views/system/taskLog'),
        meta: {
          title: '任务日志',
          activeMenu: '/system/timeOut'
        },
        hidden: true
      },
      {
        path: 'templace',
        name: 'Templace',
        component: () => import('@/views/system/templace'),
        meta: {
          title: '页面模板'
        }
      },
      {
        path: 'monitoringSYS',
        noCompoent: true,
        meta: {
          title: '系统监控'
        },
        children: [{
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
        }
        ]
      }
    ]
  },
  {
    path: '/professionalWork',
    component: ViewTem,
    meta: {
      title: '业务功能',
      hidden: true,
      icon: 'example'
    },
    children: [
      {
        path: 'table',
        noCompoent: true,
        meta: {
          title: '表格'
        },
        children: [
          {
            path: 'table1',
            name: 'Table1',
            component: () => import('@/views/professionalWork/table/table1'),
            meta: {
              title: '综合表格'
            }
          },
          {
            path: 'table2',
            name: 'Table2',
            component: () => import('@/views/professionalWork/table/table2'),
            meta: {
              title: '复杂表格'
            }
          }
        ]
      },
      {
        path: 'nested',
        noCompoent: true,
        meta: {
          title: '菜单嵌套'
        },
        children: [
          {
            path: 'menu1',
            noCompoent: true,
            meta: {
              title: '菜单1'
            },
            children: [
              {
                path: 'menu1-1',
                name: 'Menu1-1',
                component: () => import('@/views/professionalWork/nested/menu1/menu1-1'),
                meta: {
                  title: '子菜单1-1'
                }
              },
              {
                path: 'menu1-2',
                name: 'Menu1-2',
                component: () => import('@/views/professionalWork/nested/menu1/menu1-2'),
                meta: {
                  title: '子菜单1-2'
                }
              }
            ]
          },
          {
            path: 'menu2',
            name: 'Menu2',
            component: () => import('@/views/professionalWork/nested/menu2'),
            meta: {
              title: '菜单2'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/experiment',
    component: ViewTem,
    meta: {
      title: '实验室',
      hidden: true,
      icon: 'example'
    },
    children: []
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

const createRouter = () => new Router({
  mode: 'history', // require service support
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
