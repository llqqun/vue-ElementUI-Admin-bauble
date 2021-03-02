<!-- 顶部菜单 -->
<template>
  <el-menu
    :default-active="activeMenu"
    :background-color="variables.topMenuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.topTextActive"
    class="app-Menus-top"
    mode="horizontal"
  >
    <el-menu-item
      v-for="menu in menus"
      ref="menu"
      :key="menu.path"
      :index="menu.path"
      @click="setMenus(menu)"
    >
      <svg-icon :icon-class="menu.icon" />
      <span slot="title">{{ menu.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
import variables from '@/styles/variables.scss';
export default {
  name: 'MenusTop',
  data() {
    return {
      oldActive: ''
    };
  },
  computed: {
    ...mapGetters(['menus']),
    activeMenu() {
      let activePath = '';
      let obj;
      const { path } = this.$route;
      const lastLength = path.indexOf('/', 1);
      activePath = path.substring(path.indexOf('/'), lastLength) || '/';
      if (activePath === '/redirect') {
        activePath = path.substring(lastLength, path.indexOf('/', lastLength + 1)) || '/';
      }
      if (activePath === '/') {
        activePath = '/system';
        obj = this.menus[0];
      } else if (activePath === '/404') {
        return '/system';
      }
      this.utilMenus(activePath);
      return activePath;
    },
    variables() {
      return variables;
    }
  },
  mounted() {
    // console.log(this.menus)
  },
  methods: {
    setMenus(menu) {
      this.$store.commit('permission/LEFT_MENUS', { ...menu });
    },
    utilMenus(path) {
      const obj = this.menus.find(function(item) {
        return item.path === path;
      });
      setTimeout(() => {
        this.setMenus(obj);
      }, 200);
    }
  }
};
</script>
<style lang='scss' scoped>
.app-Menus-top{
  .el-menu-item {
    font-size: 18px;
    font-family: monospace;
    line-height: 50px;
    height: 50px;
  }
  .svg-icon {
    vertical-align: middle;
    font-size: 20px;
    margin-right: 5px;
  }
  .el-menu{
    border-bottom: none !important;
  }
  .el-menu-item {
    border-bottom: none !important;
    border-radius: 10px 10px 0px 0px;
  }
  .el-menu-item.is-active{
    background-color: #304156 !important;
    border-radius: 10px 10px 0px 0px;
  }
}
</style>
