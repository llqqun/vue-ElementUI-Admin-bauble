<template>
  <section class="app-main">
    <!-- 添加滚动条插件,高度设置为屏幕高度减去右侧顶部功能栏高度 -->
    <el-scrollbar
      :noresize="true"
      wrap-class="app-main-scrollbar-wrapper"
      style="height:calc(100vh - 84px);"
    >
      <div class="main-outer-space">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view :key="key" />
          </keep-alive>
        </transition>
      </div>
    </el-scrollbar>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
  },
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 84px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
.app-main-scrollbar-wrapper {
  overflow-x: hidden;
  background-color: #f3f1f1;
}
.main-outer-space {
  padding: 10px;
  height: 100%;
}
</style>
