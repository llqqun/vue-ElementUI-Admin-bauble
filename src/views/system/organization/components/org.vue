<!-- 组织机构 -->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;flex-direction: row;align-items: center;">
        <span>组织机构</span>
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
          :data="tableData"
          :props="defaultProps"
          default-expand-all
          node-key="id"
          :filter-node-method="filterNode"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <div class="tree-conner">{{ node.label }}</div>
            <div class="right-btn">
              <el-button type="text" @click.stop="() => handleDep(data)">
                <i class="el-icon-house" />
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
      :title="dialogType==='edit'?'编辑机构':'新增机构'"
      width="30%"
      @close="closeDialogFun('saveForm')"
    >
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="机构名称" />
        </el-form-item>
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="saveForm.keyword" placeholder="机构关键词" />
        </el-form-item>
        <el-form-item label="上级机构">
          <user-Select v-model="saveForm.pid" :options="tableData" label="name" placeholder="请选择父级菜单" />
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
  keyword: '',
  name: ''
};

export default {
  name: 'Org',
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
      tableData: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
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
          post('/api/system/auth/org/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.getTableData();
          });
        }
      });
    },
    handleDelete(row) {
      delMessage('/api/system/auth/org/remove/' + row.id).then(res => {
        if (res) {
          this.getTableData();
        }
      });
    },
    getTableData() {
      this.loading = true;
      get('/api/system/auth/org/tree').then(res => {
        this.tableData = res.data;
        this.$nextTick(() => {
          res.loading.close();
        });
      });
    },
    handleDep(data) {
      this.$emit('lookDep', data);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
