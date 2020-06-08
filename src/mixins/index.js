import templace from '@/utils/tableTemplace';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      tableTem: templace
    };
  },
  computed: {
  },
  methods: {
    /**
     * dialog关闭时清除验证结果
     * @param str
     */
    closeDialogFun(str) {
      this.$refs[str].clearValidate();
    },
    /**
     *  暂时性解决滚动条初始时不显示的bug
     * @param scrollName
     * @param tableName
     */
    setScrollTable(scrollName, tableName) {
      setTimeout(() => {
        const clientHeight = this.$refs[scrollName].$el.clientHeight;
        const scrollHeight = this.$refs[tableName].$el.scrollHeight;
        const heightPercentage = (clientHeight * 100 / scrollHeight);
        this.$refs.scrollbar.sizeHeight = heightPercentage + '%';
      }, 600);
    }
  }
};
