import defaultSettings from '@/settings'
import variables from '@/styles/element-variables.scss'

const { showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  tagsView: tagsView,
  sidebarLogo: sidebarLogo,
  theme: variables.theme
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) { // 判断一个对象是否有给出名称的属性或对象
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

