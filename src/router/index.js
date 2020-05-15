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
    component: ViewTem,
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
    component: ViewTem,
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
