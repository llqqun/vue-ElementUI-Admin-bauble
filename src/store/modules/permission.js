import { constantRoutes, asyncRoutes } from '@/router';
import { mockMenu, mockRouter } from '@/api/global';
import viewTem from '@/viewTem';
import store from '@/store';
/**
 * 生成路由
 * @param menus
 */
function filterTreeMenus(menus) {
  return menus.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = viewTem;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterTreeMenus(route.children);
    }
    return true;
  });
}

/**
 * 路由懒加载
 * @param route
 * @param aynRoute
 * @returns {boolean|{[p: string]: *}}
 */
function loadView(routePath) {
  return (resolve) => require([`@/views/${routePath}`], resolve);
}

/**
 * 嵌套路由转换
 * @param router 生成的路由表
 * @param prefix
 * @returns {Array}
 */
function delteFakeParent(router, prefix) {
  var newRouter = { ...router };
  if (prefix) {
    newRouter.path = prefix + '/' + router.path;
  }
  if (!router.path) return false;
  if (!router.children) return newRouter;
  var children = [];
  if (router.noCompoent) {
    for (let i = 0; i < router.children.length; i++) {
      const item = delteFakeParent(router.children[i], newRouter.path);
      if (Array.isArray(item)) {
        item.forEach(el => {
          children.push(el);
        });
      } else {
        children.push(item);
      }
    }
    newRouter = children;
  } else {
    for (let i = 0; i < router.children.length; i++) {
      const item = delteFakeParent(router.children[i]);
      if (Array.isArray(item)) {
        item.forEach(el => {
          children.push(el);
        });
      } else {
        children.push(item);
      }
    }
    newRouter.children = children;
  }

  return newRouter;
}
/* 菜单生成路由 */
function transitionRouter(menus) {
  let accessedRoutes;
  const newRouter = [];
  if (menus.length) {
    accessedRoutes = filterTreeMenus(menus);
  } else {
    accessedRoutes = [];
  }
  for (let i = 0; i < accessedRoutes.length; i++) {
    const item = delteFakeParent(accessedRoutes[i]);
    if (item) {
      newRouter.push(item);
    }
  }
  console.log(newRouter);
  return newRouter;
}
const state = {
  router: [],
  btnRoles: [],
  menus: [],
  leftMenus: []
};

const mutations = {
  LEFT_MENUS: (state, data) => {
    state.leftMenus = data || [];
  },
  SET_ROUTER: (state, data) => {
    state.router = constantRoutes.concat(data);
  },
  SET_MENUS: (state, data) => {
    state.menus = data;
  },
  SET_BTN: (state, data) => {
    state.btnRoles = data;
  },
  REMOVE_MENUS: (state) => {
    state.menus = [];
    state.leftMenus = [];
    state.router = [];
    state.btnRoles = [];
    localStorage.clear();
  }
};

const actions = {
  // 拉取用户菜单
  getUserMenu({ commit, state }, id) {
    return new Promise(async(resolve, reject) => {
      let newRouter = [];
      const routerMenus = JSON.parse(localStorage.getItem('router'));
      if (routerMenus) {
        newRouter = routerMenus.menus;
        commit('SET_MENUS', routerMenus.menus);
        commit('SET_BTN', routerMenus.btn);
      } else {
        // if (store.getters.userInfo.name === 'admin') {
        //   newRouter = asyncRoutes;
        //   commit('SET_MENUS', asyncRoutes);
        //   commit('SET_BTN', ['sys:resource:add']);
        // } else {
          await mockRouter(store.getters.token).then(response => {
            const { data } = response;
            newRouter = data.menus;
            commit('SET_MENUS', data.menus);
            localStorage.setItem('router', JSON.stringify(data));
            commit('SET_BTN', data.btn);
          }).catch(error => {
            reject(error);
          });
        // }
      }
      const rou = transitionRouter(newRouter);
      commit('SET_ROUTER', rou);
      rou.push({ path: '*', redirect: '/404', hidden: true });
      resolve(rou);
    });
  },
  resetPer({ commit, state }) {
    commit('REMOVE_MENUS');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
