<template>
  <el-card>
    <el-tabs v-model="activeTab">
      <!-- <el-tab-pane label="个人信息" name="userMessage"></el-tab-pane> -->
      <el-tab-pane label="密码修改" name="passwordUpdate">
        <el-form ref="formObj" :model="formObj" :rules="rules">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model.trim="formObj.oldPassword" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model.trim="formObj.newPassword" />
          </el-form-item>
          <el-form-item label="确认密码" prop="password">
            <el-input v-model.trim="formObj.password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="UpdatePassword">修 改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="头像修改" name="imgUpdate">
        <!--<el-upload
          class="avatar-uploader"
          :action="imgUploadPath"
          :show-file-list="false"
          :headers="{ 'Authorization': 'bearer ' + token }"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="basePath + imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>-->
        <my-upload
          v-model="show"
          field="file"
          :width="300"
          :height="300"
          :url="imgUploadPath"
          :lang-ext="langCH"
          :params="params"
          :headers="{ 'Authorization': 'bearer ' + token }"
          img-format="png"
          @crop-success="cropSuccess"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
        />
        <el-button type="primary" @click="show = true">修 改</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { post, put } from '@/api/common';
import { mapGetters } from 'vuex';
import myUpload from 'vue-image-crop-upload';

const defaultData = {
  id: null,
  password: '',
  newPassword: '',
  oldPassword: ''
};
export default {
  name: 'RightCard',
  components: { myUpload },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.formObj.newPassword !== '') {
          this.$refs.formObj.validateField('password');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formObj.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      show: false,
      params: {
        name: 'avatar'
      },
      imageUrl: '',
      langCH: {
        preview: '图片预览'
      },
      formObj: Object.assign({}, defaultData),
      activeTab: 'imgUpdate',
      imgObj: {
        avatar: '',
        id: this.$store.state.user.userInfo.id
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'imgUploadPath', 'token', 'basePath'])
  },
  methods: {
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------');
      // console.log(imgDataUrl);
    },
    cropUploadSuccess(response) {
      console.log('-------- upload success --------');
      console.log(response);
      if (response.code === 0) {
        console.log(response.data.imgPath);
        this.$store.commit('user/SET_AVATAR', response.data.imgPath);
      } else {
        this.$message.error('图片错误!');
      }
    },
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------');
      console.log(status);
      console.log('field: ' + field);
    },
    UpdatePassword() {
      this.$refs['formObj'].validate(valid => {
        if (valid) {
          this.formObj.id = parseInt(this.$store.state.user.id);
          post('/api/system/auth/admin/change/password', this.formObj).then(
            res => {
              if (res.code === 0) {
                this.$confirm(
                  '单击确定重新登入,继续操作请点取消',
                  '密码修改成功',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                )
                  .then(async() => {
                    await this.$store.dispatch('user/logout');
                    this.$router.push(`/login?redirect=/dashboard`);
                  })
                  .catch(() => {
                    this.formObj = Object.assign({}, defaultData);
                  });
              }
            }
          );
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    UpdateImg(url) {
      put('/api/system/auth/admin/avatar/save', this.imgObj).then(res => {
        this.$store.dispatch('user/userInfo', this.$store.state.user.id);
        this.$message({
          type: 'success',
          message: '修改成功'
        });
      });
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data.imgPath;
      this.imgObj.avatar = res.data.imgPath;
      this.$store.commit('user/SET_AVATAR', res.data.imgPath);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
