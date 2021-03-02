<template>
  <div class="navbar" :style="{'background': variables.topMenuBg}">
    <logo :collapse="isCollapse" />
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <menustop class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <Thempick />
      </template>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="resolvePath(userInfo.avatar)" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/people">
            <el-dropdown-item divided>
              <span style="display:block;">个人中心</span>
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import userAvater from '@/assets/man.jpg';
import { mapGetters } from 'vuex';
import logo from './Logo';
import variables from '@/styles/variables.scss';
import Menustop from './MenusTop';
import Hamburger from '@/components/Hamburger';
import Thempick from '@/components/ThemPick';
import { isExternal } from '@/utils/validate';

export default {
  components: {
    Menustop,
    Thempick,
    Hamburger,
    logo
  },
  data() {
    return {
      imgAvater: userAvater
    };
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'device', 'basePath']),
    variables() {
      return variables;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`); //退出记录最后的路由
      this.$router.push(`/login?redirect=/`);
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return this.basePath + routePath;
    }
  }
};
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: fixed;
    top: 0;
    z-index: 9;
    background: #bbe6d6;
    width: 100%;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
