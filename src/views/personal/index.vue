<!-- 个人中心 -->
<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :users="userInfo"/>
        </el-col>

        <el-col :span="18" :xs="24">
          <right-card />
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard';
import RightCard from './components/RightCard';
import { mapGetters } from 'vuex';

export default {
  name: 'Profile',
  components: { UserCard, RightCard },
  computed: {
    ...mapGetters(['userInfo'])
  }
};
</script>
