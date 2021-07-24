<template>
  <div>
    <el-upload
      class="img-block-uploader"
      :action="imgUploadPath"
      :data="{source: 'clound'}"
      :show-file-list="false"
      :headers="{ 'Authorization': 'bearer ' + token }"
      :on-success="handleAvatarSuccess"
    >
      <el-image
        v-if="imageUrl"
        style="width: 120px; height: 120px"
        :src="imageUrl"
        fit="contain"
      />
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Upimage',
  data() {
    return {
      imgUploadPath: '',
      token: '',
      imageUrl: ''
    };
  },
  methods: {
    handleAvatarSuccess: function() {

    }
  }
};
</script>

<style scoped lang="scss">

</style>
