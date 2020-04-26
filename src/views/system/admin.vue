<!-- 用户管理 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filterForm.userName" class="filter-item" placeholder="搜索登入名称" clearable />
      <el-input v-model="filterForm.mobile" class="filter-item" placeholder="搜索手机号" clearable />
      <user-Select v-model="filterForm.orgId" class="filter-item" :options="orgTree" label="name" @selectVal="orgSelectFun" />
      <user-Select v-model="filterForm.deptId" class="filter-item" :options="depSelect" label="name" :disabled="depFDisabled" />
      <el-button type="primary" icon="el-icon-search" @click="getTableData">搜索</el-button>
      <el-button v-if="RP(['sys:admin:add'])" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table ref="tableData" :data="tableData" row-key="id" border :max-height="tableHeight" :highlight-current-row="true">
      <el-table-column prop="userName" label="登录名称" fixed min-width="120" align="center" />
      <el-table-column prop="realName" label="姓名" fixed min-width="120" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="mobile" label="联系方式" min-width="120" align="center" />
      <el-table-column prop="deptJob" label="部门/岗位" min-width="150" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="lastLoginIp" label="最后登入ip" min-width="150" align="center" />
      <el-table-column prop="lastLoginTime" label="最后登入时间" min-width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="240" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="RP(['sys:admin:edit'])" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="RP(['sys:admin:del'])" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogType==='edit' ? '编辑管理员': '新增管理员'"
      width="30%"
      @close="closeDialogFun('saveForm')"
    >
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="登录名称" prop="userName">
          <el-input v-model="saveForm.userName" placeholder="登录名称" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="saveForm.realName" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="saveForm.mobile" />
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="saveForm.email" />
        </el-form-item>
        <el-form-item label="组织机构">
          <user-Select v-model="saveForm.orgId" :options="orgTree" label="name" @selectVal="selectOrg"/>
        </el-form-item>
        <el-form-item label="所属部门">
          <user-Select v-model="saveForm.deptId" :options="depSelect" label="name" :disabled="depDisabled" @selectVal="getJobSelect" />
        </el-form-item>
        <el-form-item label="所属岗位">
          <user-Select v-model="saveForm.jobId" :disabled="disabled" :options="jobSelect" label="name"/>
        </el-form-item>
        <el-form-item label="所属角色" prop="roles">
          <user-Select v-model="saveForm.roles" :options="rolesSelect" :multiple="true" label="name"/>
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
import { mapGetters } from 'vuex';

const defaultData = {
  id: null,
  avatar: '',
  deptId: null,
  email: '',
  jobId: null,
  mobile: '',
  password: '',
  orgId: null,
  orgName: '',
  roles: [],
  status: 1,
  userName: '',
  realName: ''
};

export default {
  name: 'Admin',
  filters: {
    statusFilter(status) {
      const statusMap = ['停用', '启用'];
      return statusMap[status];
    }
  },
  data() {
    return {
      saveForm: Object.assign({}, defaultData),
      disabled: true,
      depDisabled: true,
      depFDisabled: true,
      filterForm: {
        size: 25,
        total: 1,
        current: 1,
        name: null
      },
      rolesSelect: [],
      orgTree: [],
      depSelect: [],
      jobSelect: [],
      dialogVisible: false,
      dialogType: 'add',
      tableData: [],
      rules: {
        userName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        roles: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight'])
  },

  async mounted() {
    // this.getTableData();
  },

  methods: {
    rolesPermission,
    // 搜索栏方法
    async orgSelectFun(node) {
      if (node.id) {
        await this.getDepSelect(node.id);
        this.depFDisabled = false;
      } else {
        this.depFDisabled = true;
        this.saveForm.deptId = null;
      }
    },
    // 搜索栏方法end
    handleCurrentChange(page) {
      this.filterForm.current = page;
      this.getTableData();
    },
    handleReset() {},
    handleFilter() {},
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
          post('/api/system/auth/admin/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.getTableData();
          });
        }
      });
    },
    async handleEdit(row) {
      this.saveForm = deepClone(row);
      if (row.orgId) {
        await this.getDepSelect(row.orgId);
        if (row.deptId) {
          await this.getJobSelect({ id: row.deptId });
        }
      }
      await post('/api/system/auth/admin/roles/' + row.id).then(res => {
        if (res.data && res.data.length > 0) {
          const arr = [];
          res.data.forEach(element => {
            arr.push(element.id);
          });
          this.saveForm['roles'] = arr;
        }
        this.$nextTick(() => {
          res.loading.close();
        });
      });
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    handleDelete(row) {
      delMessage('/api/system/auth/admin/remove/' + row.id).then(res => {
        if (res) {
          if (this.tableData.length === 1) {
            this.filterForm.current =
              this.filterForm.current - 1 > 0 ? this.filterForm.current - 1 : 1;
          }
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
      get('/api/system/auth/admin/page', this.filterForm).then(res => {
        this.tableData = res.data.records;
        this.filterForm.total = res.data.total;
        this.$nextTick(() => {
          res.loading.close();
        });
      });
    },
    selectOrg(node) {
      if (node.id) {
        this.getDepSelect(node.id);
      } else {
        this.depSelect.length = 0;
        this.saveForm.deptId = null;
        this.depDisabled = true;
      }
      this.saveForm.orgName = node.name;
    },
    getJobSelect(node) {
      if (node.id) {
        get('/api/system/auth/job/list/dept/' + node.id).then(res => {
          this.jobSelect = res.data;
          this.disabled = false;
          this.$nextTick(() => {
            res.loading.close();
          });
        });
      } else {
        this.jobSelect.length = 0;
        this.saveForm.jobId = null;
        this.disabled = true;
      }
    },
    async getRolesSelect() {
      await get('/api/system/auth/role/list').then(res => {
        this.rolesSelect = res.data;
      });
    },
    async getOrgSelect() {
      await get('/api/system/auth/org/tree').then(res => {
        this.orgTree = res.data;
      });
    },
    getDepSelect(id) {
      get('/api/system/auth/dept/tree?orgId=' + id).then(res => {
        this.depSelect = res.data;
        this.depDisabled = false;
        this.filterForm.deptId = null;
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
