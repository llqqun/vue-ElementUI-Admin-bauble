const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  btnRoles: state => state.permission.btnRoles,
  menus: state => state.permission.menus,
  router: state => state.permission.router, // 路由
  leftMenus: state => state.permission.leftMenus,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  tableHeight: state => state.global.heightTable,
  fileUploadPath: state => state.global.fileUploadPath,
  imgUploadPath: state => state.global.imgUploadPath,
  basePath: state => state.global.basePath,
  tableColTemplate: state => state.formCol.tableTemplate
};
export default getters;
