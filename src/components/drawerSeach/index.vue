<!-- 未完成 -->
<template>
  <el-drawer
    :with-header="false"
    custom-class="filter-drawer"
    direction="ttb"
    :modal="false"
    :visible.sync="filterDrawer"
    :append-to-body="false"
  >
    <div class="filter-container">
      <div v-for="(item,index) in seachOption" :key="index" class="filter-scope">
        <span>{{ item.label }}:</span>
        <el-input v-model="filterForm.bankCardNo" placeholder="搜索卡号" clearable class="filter-item" />
      </div>
    </div>
    <div style="margin: 10px auto;text-align: center;">
      <el-button type="primary" icon="el-icon-search" class="filter-btn" @click="searchHandle">确定</el-button>
      <el-button type="danger" icon="el-icon-refresh" class="filter-btn" @click="resetFilter">重置</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  model: {
    prop: 'filterForm',
    event: 'setModel'
  },
  props: {
    filterDrawer: {
      type: Boolean,
      default: false
    },
    seachOption: {
      type: Array,
      default: function() {
        return [];
      }
    },
    filterForm: {
      type: [Object],
      default: function() {
        return null;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    searchHandle() {},
    resetFilter() {}
  }
};
</script>

<style scoped>

</style>
