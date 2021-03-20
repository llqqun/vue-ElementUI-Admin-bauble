<template>
  <div class="dashboard-container">
    <button @click="addP">添加P</button>
    <p v-for="item in list" :key="item">{{item}}</p>
    <component :is="currentRole" />
  </div>
</template>

<script>
import adminDashboard from './admin';

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      list: []
    };
  },
  methods: {
    addP: function() {
      this.list.push(Math.round(Math.random() * 10000));
    }
  }
};
</script>
