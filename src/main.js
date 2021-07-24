import Vue from 'vue';

import 'normalize.css/normalize.css'; // CSS resets

import ElementUI from 'element-ui';
import './styles/element-variables.scss';
import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import * as filters from './filters';
import mixins from './mixins';
import '@/icons'; // icon

import './plugins/index'; // 第三方插件包引入
import '@/permission'; // permission control
import rolesPermission from '@/utils/permission';
import userSelect from '@/components/userSelect';

Vue.prototype.RP = rolesPermission;

// 自动化全局注册组件
// 不会使用webpack不要乱改此处代码
const pp = require.context('./components', true, /\.vue$/);
pp.keys().forEach(fileName => {
  const componentConfig = pp(fileName);
  const name = fileName.split('/').splice(1, 1);
  try {
    Vue.component(name[0], componentConfig.default || componentConfig);
  } catch (e) {
    console.log(e);
    console.log(name);
  }
});
/*import { mockXHR } from '../mock';*/
/*if (process.env.NODE_ENV === 'production') {
  mockXHR();
}*/
// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// 全局复用
Vue.mixin(mixins);

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  size: 'small',
  zIndex: 3000
});
Vue.use(userSelect);
// Vue.component('user-Select', userSelect);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
