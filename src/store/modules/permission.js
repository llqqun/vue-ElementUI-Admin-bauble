import { constantRoutes, asyncRoutes } from '@/router';
import { mockRouter } from '@/api/global';
import store from '@/store';

/* 菜单生成路由 */
function transitionRouter(menus) {
  let accessedRoutes;
  if (menus.length) {
    accessedRoutes = filterTreeMenus(asyncRoutes, menus);
  } else {
    accessedRoutes = [];
  }
  return accessedRoutes;
}

/**
 * 生成路由
 * @param routes
 * @param rolesMenu
 * @param path
 */
function filterTreeMenus(routes = [], rolesMenu, path) {
  let res = [];
  rolesMenu.forEach(node => {
    // if (node.path === 'components') debugger;
    if (node.noComponent) {
      res = res.concat(filterTreeMenus(routes, node.children, node.path));
    } else {
      const routeObj = vailPer(routes, node);
      if (routeObj) {
        if (node.children) {
          routeObj['children'] = filterTreeMenus(routeObj.children, node.children, routeObj.path) || [];
        }
        res.push(routeObj);
      } else {
        console.log('无组件:' + node.name);
      }
    }
  });
  return res;
}

function vailPer(routes, aynRoute) {
  if (aynRoute.path && aynRoute.path !== '') {
    const obj = routes.find(item => item.path === aynRoute.path);
    if (obj) return { ...obj };
  }
  return false;
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
    return new Promise((resolve, reject) => {
      let newRouter = [];
      mockRouter(store.getters.token).then(response => {
        const { data } = response;
        newRouter = data.menus;
        commit('SET_MENUS', data.menus);
        commit('SET_BTN', data.btn);
        const rou = transitionRouter(newRouter);
        console.log(rou);

        rou.push({ path: '*', redirect: '/404', hidden: true });
        commit('SET_ROUTER', rou);
        resolve(rou);
      }).catch(error => {
        reject(error);
      });
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
