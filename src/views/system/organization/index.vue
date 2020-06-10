<!-- 机构管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <org :reset="getOrg" :table-data="OrgData" @lookDep="handleDep"></org>
      </el-col>
      <el-col :span="8">
        <transition name="lqTran">
          <post :org-father="OrgData" :reset="getDep" :title="depTitle" :org-id="orgId" :table-data="depOption" @lookJob="handleJob"></post>
        </transition>
      </el-col>
      <el-col :span="8">
        <transition name="lqTran">
          <job :dep-father="depOption" :title="jobTitle" :dep-id="depId" :job-data="jobData" :reset="getJOb"></job>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import org from './components/org';
import post from './components/post';
import job from './components/job';
import { get } from '@/api/common';

export default {
  name: 'Organization',
  components: {
    org, post, job
  },
  data() {
    return {
      orgId: null,
      depId: null,
      depTitle: '',
      jobTitle: '',
      depOption: [],
      OrgData: [],
      jobData: []
    };
  },
  mounted() {
    this.getOrg();
  },
  methods: {
    getOrg() {
      get('/api/system/auth/org/tree').then(res => {
        this.OrgData = res.data;
      });
    },
    getDep() {
      get('/api/system/auth/dept/tree?orgId=' + this.orgId).then(res => {
        this.depOption = res.data;
      });
    },
    getJOb() {
      get('/api/system/auth/job/list/dept/' + this.depId).then(res => {
        this.jobData = res.data;
      });
    },
    handleDep(data) {
      this.orgId = data.id;
      this.depTitle = data.name;
      this.getDep();
    },
    handleJob(data) {
      this.depId = data.id;
      this.jobTitle = data.name;
      this.getJOb();
    }
  }
};
</script>

<style scoped>
  .app-container {
    background: none;
  }
</style>
