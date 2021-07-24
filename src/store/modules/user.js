import { login, logout, getInfo } from '@/api/user';
import { getToken, setToken, removeToken, setUserID } from '@/utils/auth';
import { resetRouter } from '@/router';
import store from '../index';

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: { id: 0, name: '', avatar: '' }
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_AVATAR: (state, url) => {
    state.userInfo.avatar = url || '';
  },
  SET_USERINFO: (state, data) => {
    state.userInfo = data;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data: { token, user }} = response;
        commit('SET_TOKEN', token);
        commit('SET_USERINFO', user);
        setToken(token);
        setUserID(user.id);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.token.indexOf('admin')) {
        commit('SET_USERINFO', {
          id: 99999,
          name: 'admin',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        });
        resolve();
      } else {
        getInfo(state.token).then(response => {
          const { data } = response;
          commit('SET_USERINFO', data);
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      }
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken();
        resetRouter();
        commit('RESET_STATE');
        store.dispatch('tagsView/delAllViews', null, { root: true });
        store.dispatch('permission/resetPer');
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

