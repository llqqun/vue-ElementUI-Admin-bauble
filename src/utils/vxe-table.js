const vxe_table_option = {
  // size: null, // 全局尺寸
  zIndex: 3000, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡
  // version: 0, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据
  pager: {
    align: 'center',
    pageSizes: [10, 25, 50, 100]
  },
  table: {
    keepSource: false,
    checkboxConfig: {
      trigger: 'default',
      highlight: true
    }
  },
  modal: {
    minWidth: 500,
    minHeight: 300,
    mask: false,
    duration: 3000,
    marginSize: 8,
    dblclickZoom: true,
    showTitleOverflow: true,
    storage: false,
    transfer: true
  }
};
export default vxe_table_option;
