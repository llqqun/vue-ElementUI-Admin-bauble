<!-- 部门职位 -->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;flex-direction: row;align-items: center;">
        <span>{{ title || '部门职位' }}</span>
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
          :data="jobData"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          :filter-node-method="filterNode"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <div class="tree-conner">{{ node.label }}</div>
            <div class="right-btn">
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
      :title="dialogType==='edit' ? '编辑职位' : '新增职位'"
      width="30%"
      @close="closeDialogFun('saveForm')"
    >
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
        width="35%"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="所属部门">
          <user-Select v-model="saveForm.deptId" :options="depFather" label="name" />
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

const defaultData = {
  id: null,
  name: '',
  deptId: null
};

export default {
  name: 'Post',
  props: {
    reset: {
      type: Function,
      default: function() {
        return false;
      }
    },
    jobData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: '机构部门'
    },
    depFather: {
      type: Array,
      default: function() {
        return [];
      }
    },
    depId: {
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
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleCreate() {
      this.dialogType = 'add';
      this.saveForm = Object.assign({}, defaultData);
      this.saveForm.deptId = this.depId;
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
          post('/api/system/auth/job/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.reset();
          });
        }
      });
    },
    handleDelete(row) {
      delMessage('/api/system/auth/job/remove/' + row.id).then(res => {
        if (res) {
          this.reset();
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
  .app-container {
    background: none;
    padding: 0;
  }
</style>
