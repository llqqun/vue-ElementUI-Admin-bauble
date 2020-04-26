<!-- 机构管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <org @lookDep="handleDep"></org>
      </el-col>
      <el-col :span="8">
        <transition name="lqTran">
          <post :org-id="orgId" @lookJob="handleJob"></post>
        </transition>
      </el-col>
      <el-col :span="8">
        <transition name="lqTran">
          <job :dep-id="depId" :dep-option="depOption"></job>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import org from './components/org';
import post from './components/post';
import job from './components/job';

export default {
  name: 'Organization',
  components: {
    org, post, job
  },
  data() {
    return {
      orgId: null,
      depId: null,
      depOption: []
    };
  },
  methods: {
    handleDep(data) {
      this.orgId = data.id;
    },
    handleJob(data) {
      this.depId = data.id;
      this.depOption = [data];
    }
  }
};
</script>

<style scoped>

</style>
