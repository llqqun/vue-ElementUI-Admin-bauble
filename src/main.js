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
// vxeTable
import XEUtils from 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import VXETablePluginElement from 'vxe-table-plugin-element'; // 兼容饿了么组件
import vxe_table_option from '@/utils/vxe-table'; // 全局vxeTable配置
VXETable.setup(vxe_table_option);
VXETable.use(VXETablePluginElement);
Vue.use(VXETable);
Vue.prototype.$XModal = VXETable.modal;
Vue.prototype.VXETable = VXETable;
Vue.prototype.XEUtils = XEUtils;
Vue.prototype.RP = rolesPermission;
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
