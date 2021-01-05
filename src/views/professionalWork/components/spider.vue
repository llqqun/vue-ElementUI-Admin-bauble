<template>
  <div class="app-container spider">
    <el-row class="filter-container">
      <el-input v-model="content" placeholder="搜索内容" clearable class="filter-item" />
      <el-button type="primary" icon="el-icon-search" @click="seacrContent">搜索</el-button>
    </el-row>
    <el-row>
      内容
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request';
export default {
  name: 'Spider',
  data() {
    return {
      content: ''
    };
  },
  methods: {
    seacrContent() {
      console.log(this.content);
      request({
        url: 'https://www.rourouwu.com/read/63459//',
        method: 'get',
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: { type: 'pass' }
      });
    }
  }
};
</script>

<style scoped lang="scss">

</style>
