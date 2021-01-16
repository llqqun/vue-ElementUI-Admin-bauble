import store from '@/store';
import { mapGetters } from 'vuex';

const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design

export default {
  computed: {
    ...mapGetters(['sidebar']),
    isCollapse() {
      let clearLeft = 210;
      if (!this.sidebar.opened) {
        clearLeft = 54;
      }
      return clearLeft;
    }
  },
  watch: {
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false });
      }
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler);
    window.addEventListener('resize', this.$_resizeContentFont);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler);
    window.removeEventListener('resize', this.$_resizeContentFont);
  },
  mounted() {
    const isMobile = this.$_isMobile();
    this.$_resizeContentFont();
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile');
      store.dispatch('app/closeSideBar', { withoutAnimation: true });
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect();
      return rect.width - 1 < WIDTH;
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile();
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop');

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true });
        }
      }
    },
    // 按16px的基础尺寸动态响应屏幕宽度变化
    $_resizeContentFont() {
      const contentWidth = window.innerWidth - this.isCollapse;
      document.getElementsByTagName('html')[0].style.fontSize = contentWidth * 0.00833 + 'px';
    }
  }
};
