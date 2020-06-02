<!-- 角色管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="rowWidth">
        <el-card
          class="box-card"
        >
          <div slot="header" class="clearfix">
            <span>角色列表</span>
            <el-button
              size="mini"
              type="primary"
              style="float: right;"
              @click="addRoles"
            >添加
            </el-button>
          </div>
          <el-table ref="tableData" :data="tableData" border style="width: 100%" :height="tableHeight -105">
            <el-table-column align="center" prop="name" label="名称" :show-overflow-tooltip="true" />
            <el-table-column align="center" prop="remark" label="简介" width="180" :show-overflow-tooltip="true" />
            <el-table-column align="center" label="状态">
              <template slot-scope="{row}">
                <el-tag type="success">{{ row.status | statusFilter }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click="handleResource(scope.row)">权限</el-button>
                <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <transition name="lqTran">
        <el-col v-if="show_resource" :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>权限设置</span>
              <div class="close-right" @click="closeRightRole"><i class="el-icon-error "></i></div>
              <el-button
                type="primary"
                size="mini"
                style="float: right;"
                @click="subRoules"
              >提交
              </el-button>
            </div>
            <el-scrollbar wrap-class="scrollbar-wrapper" :style="{ 'height': (tableHeight-105) + 'px'}">
              <el-tree
                ref="tree"
                :check-strictly="false"
                :data="resourceTree"
                :props="defaultProps"
                show-checkbox
                node-key="id"
              />
            </el-scrollbar>
          </el-card>
        </el-col>
      </transition>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'编辑角色':'新增角色'" width="35%" @close="closeDialogFun('saveForm')">
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色介绍">
          <el-input
            v-model="saveForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="简介"
          />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-switch
            v-model="saveForm.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmRole">确定</el-button>
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, post, getDictionary } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone } from '@/utils';
const defaultData = {
  id: null,
  remark: '',
  name: '',
  status: 1,
  level: null
};

export default {
  name: 'Roles',
  filters: {
    statusFilter(status) {
      const statusMap = ['停用', '启用'];
      return statusMap[status];
    }
  },
  data: () => ({
    rowWidth: 24,
    dialogType: 'add',
    dialogVisible: false,
    show_resource: false,
    defaultRoles: { roleId: null, resources: [] },
    tableData: [],
    resourceTree: [],
    defaultProps: { label: 'title' },
    saveForm: Object.assign({}, defaultData),
    rules: {
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
    }
  }),
  created() {
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.getResourceTree();
      this.getRolesTable();
    },
    confirmRole() {
      const _this = this;
      this.$refs['saveForm'].validate(valid => {
        if (valid) {
          return this.$message.success('成功');
          post('/api/system/auth/role/save', this.saveForm).then(res => {
            _this.dialogVisible = false;
            _this.getRolesTable();
          });
        }
      });
    },
    subRoules() {
      this.defaultRoles.resources = this.$refs.tree.getCheckedKeys() || [];
      if (this.defaultRoles.resources.length > 0) {
        this.$message.success('提交成功');
        return '';
        post('/api/system/auth/role/addRoleResources', this.defaultRoles).then(
          res => {
            this.$nextTick(() => {
              res.loading.close();
            });
            this.$message({ type: 'success', message: '提交成功' });
          }
        );
      }
    },
    closeRightRole() {
      this.show_resource = false;
      setTimeout(() => {
        this.rowWidth = 24;
      }, 310);
    },
    handleResource(row) {
      this.show_resource = true;
      this.rowWidth = 16;
    },
    addRoles() {
      this.saveForm = Object.assign({}, defaultData);
      this.dialogVisible = true;
    },
    handleDelete(row) {
      delMessage('/api/system/auth/resource/remove/' + row.id).then(res => {
        if (res) {
          this.getRolesTable();
        }
      });
    },
    handleEdit(row) {
      this.saveForm = deepClone(row);
      this.dialogVisible = true;
    },
    async getResourceTree() {
      await get('/resource/tree').then(res => {
        this.resourceTree = res.data;
      });
    },
    getRolesTable() {
      get('/roles').then(res => {
        this.tableData = res.data.list;
      }).catch(() => {
      });
    },
    closeDialogFun(str) {
      this.$refs[str].clearValidate();
    }
  }
};
</script>
<style lang='scss' scoped>
  .app-container {
    background: none;
  }
  .close-right {
    color: #ff4949;
    position: absolute;
    right: 1px;
    top: -9px;
    font-size: 25px;
    cursor: pointer;
  }
</style>
