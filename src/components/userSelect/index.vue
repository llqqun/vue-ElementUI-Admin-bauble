<template>
  <treeselect
    v-model="selectValue"
    z-index="99999999"
    :options="options"
    :placeholder="placeholder"
    no-options-text="没有数据"
    no-children-text="没有子数据"
    clear-value-text="取消"
    :always-open="alwaysOpen"
    :append-to-body="appendToBody"
    :disabled="disabled"
    :default-expand-level="expandLevel"
    :clearable="clearable"
    :multiple="multiple"
    :max-height="200"
    :normalizer="formatText"
    @select="selectVal"
    @deselect="delVal"
    @input="inputVal"
  />
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'TreeselectCustom',
  components: {
    Treeselect
  },
  model: {
    prop: 'modelValue',
    event: 'setModel'
  },
  props: {
    // 将菜单追加到<body />。
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 是否始终打开下拉列表
    alwaysOpen: {
      type: Boolean,
      default: false
    },
    expandLevel: { // 默认展开级别
      type: Number,
      default: 1
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    matchKeys: { // 根据字段过滤
      type: String,
      default: ''
    },
    filterVal: {
      type: [String, Number, Boolean],
      default: null
    },
    disabled: { // 启用禁用
      type: Boolean,
      default: false
    },
    modelValue: { // 双向绑定值
      type: [String, Number, Array, Object],
      default: null
    },
    firstArray: { // 是否默认选中第一项暂时禁用
      type: Boolean,
      default: false
    },
    clearable: { // 是否显示清除按钮
      type: Boolean,
      default: true
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    options: { // 选项列表
      type: Array,
      default: () => {
        return [];
      }
    },
    label: {
      type: String,
      default: 'label'
    },
    valueId: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      selectValue: this.modelValue
    };
  },
  computed: {},
  watch: {
    modelValue: function(val) {
      this.selectValue = this.modelValue;
      // this.arrayFirstDefault();
    }
  },
  mounted() {
    this.arrayFirstDefault();
  },
  beforeDestroy() {
    console.log('销毁前');
  },
  methods: {
    arrayFirstDefault() {
      if (this.firstArray && this.options.length > 0 && !this.selectValue) {
        this.selectVal(this.options[0]);
        this.inputVal(this.options[0][this.valueId]);
      }
    },
    formatText(node) { // 格式化
      try {
        if (this.matchKeys !== '') {
          if (node[this.matchKeys] === this.filterVal) {
            return;
          }
          if (Object.keys(node).includes('children')) {
            if (node.children.constructor === Array) {
              const off = node.children.some(item => {
                return item[this.matchKeys] !== this.filterVal;
              });
              if (!off) delete node.children;
            } else {
              delete node.children;
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
      return {
        id: node[this.valueId],
        label: node[this.label],
        children: node.children
      };
    },
    selectVal(node) { // 选中时触发
      if (node[this.valueId] === this.modelValue) return;
      this.$emit('selectVal', node);
    },
    inputVal(val) { // 值改变时触发
      this.$emit('setModel', val);
      if (val === undefined) {
        this.$emit('selectVal', { [this.valueId]: null, [this.label]: null, children: null });
      }
    },
    delVal(node) {
      console.log(node);
    }
  }
};
</script>

<style scoped lang="scss">
.vue-treeselect {
  &::v-deep {
    .vue-treeselect__value-container {
      line-height: 1.5;
    }
  }
}
</style>
