import { get } from '@/api/common';

const getDefaultState = () => {
  return {
    heightTable: document.body.offsetHeight - 230,
    company: [],
    fileUploadPath: process.env.VUE_APP_PATH + ':' + process.env.VUE_APP_API_PORT + '/api/file/upload',
    imgUploadPath: process.env.VUE_APP_PATH + ':' + process.env.VUE_APP_API_PORT + '/api/picture/upload',
    basePath: process.env.VUE_APP_PATH,
    organization: []
  };
};
const state = getDefaultState();

const mutations = {
  SET_HEIGHT: (state, height = 230) => {
    state.heightTable = document.body.offsetHeight - height;
  },
  SET_COMPANY: (state, data) => {
    state.company = data;
  },
  SET_ORGANIZATION: (state, data) => {
    state.organization = data;
  },
  REMOVE_COMPANY: (state) => {
    state.company = [];
  }
};

const actions = {
  // 全局table高度
  setHeight({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit('SET_HEIGHT', params);
      resolve(params);
    });
  },
  getCompany({ commit }, params) {
    get('/api/company/out/list').then(res => {
      commit('SET_COMPANY', res.data);
      res.loading.close();
    });
  },
  getOrg({ commit }, params) {
    get('/api/system/auth/org/tree').then(res => {
      commit('SET_ORGANIZATION', res.data);
      res.loading.close();
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
