import { login, logout, getInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
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

  SET_USERINFO: (state, data) => {
    state.userInfo = data;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response;
        commit('SET_TOKEN', data);
        setToken(data);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response;
        commit('SET_USERINFO', data);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
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

