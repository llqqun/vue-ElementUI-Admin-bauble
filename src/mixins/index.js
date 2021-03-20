import templace from '@/utils/tableTemplace';
export default {
  data() {
    return {
      tableTem: templace
    };
  },
  computed: {
  },
  mounted() {
    if (typeof this.btnPermission !== 'undefined') {
      for (let length = this.btnPermission.length - 2; length > -1; length--) {
        const bool = this.RP(this.btnPermission[length]);
        this.btnPermission[length] = bool;
        if (bool) this.btnPermission[this.btnPermission.length - 1] += 1;
      }
    }
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
