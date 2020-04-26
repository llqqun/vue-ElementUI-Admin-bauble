import { asyncRoutes, constantRoutes } from '@/router';
import { rolesMenu } from '@/api/global';

/**
 * 生成动态路由表
 * @param routes 前端路由
 * @param rolesMenu 后端菜单
 * @param path
 * @returns {Array}
 */
function filterTreeRoutes(routes, rolesMenu) {
  const res = [];
  rolesMenu.forEach(route => {
    const tmp = { ...route };
    // if (tmp.path === 'timeOut') debugger;
    const routeObj = vailPer(routes, tmp);
    if (routeObj) {
      if (tmp.children) {
        routeObj['children'] = filterTreeRoutes(routeObj.children, tmp.children) || [];
      }
      routeObj.meta.icon = tmp.icon || '';
      routeObj.meta.title = tmp.title || routeObj.meta['title'] || '';
      res.push(routeObj);
      return true;
    }
  });
  return res;
}
/**
 * 路由资源查找
 * @param {*} route 前端路由
 * @param {*} aynRoute 后端菜单
 */
function vailPer(route, aynRoute) {
  if (route && aynRoute.path && aynRoute.path !== '') {
    const obj = route.find(item => item.path === aynRoute.path);
    if (obj) {
      return { ...obj };
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * 生成新的路由
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
      rolesMenu(id).then(response => {
        const { data } = response;
        commit('SET_MENUS', data.menu);
        commit('SET_BTN', data.permissions);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  // 生成路由表
  generateRoutes({ commit, state }) {
    return new Promise(resolve => {
      let accessedRoutes;
      const newRouter = [];
      if (state.menus.length) {
        accessedRoutes = filterTreeRoutes(asyncRoutes, state.menus);
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
