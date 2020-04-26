<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <template v-if="leftMenus.children && leftMenus.children.length">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          :unique-opened="false"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="route in leftMenus.children" :key="route.path" :item="route" :base-path="leftMenus.path" />
        </el-menu>
      </template>
      <template v-else-if="!isCollapse">
        <div class="no-menus-lq">
          <svg-icon icon-class="box2" style="font-size: 30px;"/>
          <span>没有侧边菜单</span>
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'leftMenus']),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
<style lang="scss">
.sidebar-container .el-menu-item,
.sidebar-container .el-submenu__title {
  //font-size: 16px;
}
</style>
