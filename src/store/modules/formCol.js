const modulesFiles = require.context('./setCol', false, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});
const getDefaultState = () => {
  return {
    tableTemplate: modules
  };
};
const state = getDefaultState();

export default {
  namespaced: true,
  state
};
