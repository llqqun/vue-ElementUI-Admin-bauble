<!-- 机构部门 -->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;flex-direction: row;align-items: center;">
        <span>机构部门</span>
        <el-input
          v-model="filterText"
          style="flex: 1;margin: 0 10px;"
          placeholder="输入关键字进行过滤"
        />
        <el-button type="primary" style="float: right;" @click="handleCreate">添加</el-button>
      </div>
      <el-scrollbar wrap-class="scrollbar-wrapper" class="custom-scrollbar">
        <el-tree
          ref="tree"
          :data="depTree"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          :filter-node-method="filterNode"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <div class="tree-conner">{{ node.label }}</div>
            <div class="right-btn">
              <el-button type="text" @click.stop="() => handleDep(data)">
                <svg-icon icon-class="post" />
              </el-button>
              <el-button type="text" @click.stop="() => handleEdit(data)">
                <i class="el-icon-edit" />
              </el-button>
              <el-button type="text" @click.stop="() => handleDelete(data)">
                <i class="el-icon-delete" />
              </el-button>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
    </el-card>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogType==='edit' ? '编辑部门' : '新增部门'"
      width="30%"
      @close="closeDialogFun('saveForm')">
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
        width="35%"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="上级部门">
          <user-Select v-model="saveForm.pid" :options="depTree" label="name" />
        </el-form-item>
        <el-form-item label="所属机构" prop="orgId">
          <user-Select v-model="saveForm.orgId" :disabled="true" :options="organization" label="name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmData">确定</el-button>
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone } from '@/utils';
import { mapGetters } from 'vuex';

const defaultData = {
  id: null,
  pid: null,
  orgId: null,
  name: ''
};

export default {
  name: 'Post',
  props: {
    orgId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: '',
      saveForm: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'add',
      depTree: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight', 'organization'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    orgId(val) {
      this.getTableData(val);
      this.filterText = '';
      defaultData.orgId = val;
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    handleCreate() {
      this.dialogType = 'add';
      this.saveForm = Object.assign({}, defaultData);
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogType = 'edit';
      this.saveForm = deepClone(row);
      this.saveForm.pid = this.saveForm.pid || null;
      this.dialogVisible = true;
    },
    confirmData() {
      this.$refs['saveForm'].validate(valid => {
        if (valid) {
          this.saveForm.pid = this.saveForm.pid || 0;
          post('/api/system/auth/dept/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.getTableData(this.orgId);
          });
        }
      });
    },
    handleDelete(row) {
      delMessage('/api/system/auth/dept/remove/' + row.id).then(res => {
        if (res) {
          this.getTableData(this.orgId);
        }
      });
    },
    getTableData(val) {
      if (!val) return;
      get('/api/system/auth/dept/tree?orgId=' + val).then(res => {
        this.depTree = res.data;
        this.$nextTick(() => {
          res.loading.close();
        });
      });
    },
    handleDep(data) {
      this.$emit('lookJob', data);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
