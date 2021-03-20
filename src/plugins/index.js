import Vue from 'vue';
import XEUtils from 'xe-utils';
import 'vxe-table/lib/style.css';
import vxe_table_option from '@/utils/vxe-table'; // 全局vxeTable配置
import VXETable from 'vxe-table';
import VXETablePluginElement from 'vxe-table-plugin-element'; // 兼容饿了么组件
import 'vxe-table-plugin-element/dist/style.css';
VXETable.use(VXETablePluginElement);
// 全局默认参数
VXETable.setup(vxe_table_option);

Vue.use(VXETable);
// 给 vue 实例挂载内部对象，例如：
Vue.prototype.$XEUtils = XEUtils;

