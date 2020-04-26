<!-- 组织机构 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="RP(['sys:org:add'])" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-scrollbar class="custom-scrollbar" wrap-class="scrollbar-wrapper">
      <el-table
        ref="tableData"

        :data="tableData"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children'}"
        border
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button v-if="RP(['sys:org:edit'])" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="RP(['sys:org:del'])" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogType==='add'?'编辑角色':'新增角色'"
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
import rolesPermission from '@/utils/permission';

const defaultData = {
  id: null,
  pid: null,
  keyword: '',
  name: ''
};

export default {
  name: 'Organization',
  filters: {
    statusFilter(status) {
      const statusMap = ['停用', '启用'];
      return statusMap[status];
    }
  },
  data() {
    return {
      saveForm: Object.assign({}, defaultData),

      dialogVisible: false,
      dialogType: 'add',
      tableData: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },

  computed: {},

  mounted() {
    this.getTableData();
  },

  methods: {
    rolesPermission,

    handleCreate() {
      this.saveForm = Object.assign({}, defaultData);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
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
    handleEdit(row) {
      this.saveForm = deepClone(row);
      this.saveForm.pid = this.saveForm.pid || null;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    handleDelete(row) {
      delMessage('/api/system/auth/org/remove/' + row.id).then(res => {
        if (res) {
          this.getTableData();
        }
      });
    },
    searchHandle() {
      this.filterForm.current = 1;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      get('/api/system/auth/org/tree').then(res => {
        this.tableData = res.data;
        this.$nextTick(() => {
          res.loading.close();
        });
      });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
