<!-- 系统配置 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="filterForm.cfgName"
        placeholder="搜索配置名称"
        style="width: 200px;"
        clearable
        class="filter-item"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="searchHandle"
      >搜索</el-button>
      <el-button v-if="RP(['sys:configuration:add'])" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-scrollbar class="custom-scrollbar" wrap-class="scrollbar-wrapper">
      <el-table ref="tableData" :data="tableData" row-key="id" border>
        <el-table-column prop="cfgName" label="配置名称" fixed min-width="160" align="center" />
        <el-table-column prop="cfgValue" label="配置参数" min-width="120" align="center" />
        <el-table-column prop="cfgCode" label="配置代码" min-width="150" align="center" />
        <el-table-column prop="status" label="配置状态" min-width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.status| statusFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="RP(['sys:configuration:edit'])" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="RP(['sys:configuration:del'])" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>

    <div class="footer-page">
      <el-pagination
        :hide-on-single-page="false"
        :current-page="filterForm.current"
        :page-size="filterForm.size"
        layout="prev, pager, next, jumper"
        :total="filterForm.total"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'" width="40%" @close="closeDialogFun('saveForm')">
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="配置名称" prop="cfgName">
          <el-input v-model="saveForm.cfgName" />
        </el-form-item>
        <el-form-item label="配置参数">
          <el-input v-model="saveForm.cfgValue" />
        </el-form-item>
        <el-form-item label="配置代码">
          <el-input v-model="saveForm.cfgCode" />
        </el-form-item>
        <el-form-item label="配置说明">
          <el-input v-model="saveForm.cfgDesc" />
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
import rolesPermission from '@/utils/permission';
import { deepClone } from '@/utils';

const defaultData = {
  id: null,
  cfgDesc: '',
  cfgCode: '',
  cfgName: '',
  cfgValue: ''
};
export default {
  name: 'Configuration',
  filters: {
    statusFilter(status) {
      const statusMap = ['停用', '启用'];
      return statusMap[status];
    }
  },
  data() {
    return {
      saveForm: Object.assign({}, defaultData),
      filterForm: {
        size: 10,
        total: 0,
        current: 1,
        cfgName: ''
      },
      dialogVisible: false,

      dialogType: 'add',
      tableData: [],
      rules: {
        cfgName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },

  mounted() {
    this.getTableData();
  },

  methods: {
    rolesPermission,

    confirmData() {
      this.$refs['saveForm'].validate(valid => {
        if (valid) {
          post('/api/sys/config/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.getTableData();
          });
        }
      });
    },
    handleCreate() {
      this.dialogType = 'add';
      this.saveForm = Object.assign({}, defaultData);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    handleEdit(row) {
      this.dialogType = 'edit';
      this.saveForm = deepClone(row);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    handleDelete(row) {
      delMessage('/api/sys/config/remove/' + row.id).then(res => {
        if (res) {
          if (this.tableData.length === 1) {
            this.filterForm.current =
              this.filterForm.current - 1 > 0 ? this.filterForm.current - 1 : 1;
          }
          this.getTableData();
        }
      });
    },
    handleCurrentChange(page) {
      this.filterForm.current = page;
      this.getTableData();
    },
    searchHandle() {
      this.filterForm.current = 1;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      get('/api/sys/config/page', this.filterForm)
        .then(res => {
          this.tableData = res.data.records;
          this.filterForm.total = res.data.total;
          this.filterForm.size = res.data.size;
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
