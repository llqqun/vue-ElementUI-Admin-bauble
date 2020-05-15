import { constantRoutes } from '@/router';
import { mockMenu } from '@/api/global';
import viewTem from '@/viewTem';
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
  }
};

const actions = {
  // 拉取用户菜单
  getUserMenu({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      const routerMenus = JSON.parse(localStorage.getItem('router'));
      if (routerMenus) {
        commit('SET_MENUS', routerMenus.menus);
        commit('SET_BTN', routerMenus.btn);
      } else {
        mockMenu(id).then(response => {
          const { data } = response;
          commit('SET_MENUS', data.menus);
          localStorage.setItem('router', JSON.stringify(data));
          commit('SET_BTN', data.btn);
        }).catch(error => {
          reject(error);
        });
      }
      resolve();
    });
  },
  // 生成路由表
  generateRoutes({ commit, state }, menus = []) {
    return new Promise(resolve => {
      let accessedRoutes;
      const newRouter = [];
      if (state.menus.length) {
        accessedRoutes = filterTreeMenus(state.menus);
      } else {
        accessedRoutes = [];
      }
      for (let i = 0; i < accessedRoutes.length; i++) {
        const item = delteFakeParent(accessedRoutes[i]);
        if (item) {
          newRouter.push(item);
        }
      }
      commit('SET_ROUTER', newRouter);
      newRouter.push({ path: '*', redirect: '/404', hidden: true });
      resolve(newRouter);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
