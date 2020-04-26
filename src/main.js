import Vue from 'vue';

import 'normalize.css/normalize.css'; // CSS resets

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'; // lang i18n
import './styles/element-variables.scss';
import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import * as filters from './filters';
import mixins from './mixins';
import '@/icons'; // icon
import '@/permission'; // permission control
import rolesPermission from '@/utils/permission';
import userSelect from '@/components/userSelect';
Vue.prototype.RP = rolesPermission;
import { mockXHR } from '../mock';
if (process.env.NODE_ENV === 'production') {
  mockXHR();
}
// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// 全局复用
Vue.mixin(mixins);
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  size: 'small',
  zIndex: 3000
});
Vue.use(userSelect);
Vue.component('user-Select', userSelect);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
