<!-- 部门职位管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <transition name="lqTran">
        <el-col :span="leftWidth">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>部门</span>
              <el-button type="primary" icon="el-icon-edit" style="float: right;" @click="handleDepCreate">添加</el-button>
            </div>
            <el-scrollbar class="custom-scrollbar" wrap-class="scrollbar-wrapper">
              <el-table
                ref="tableData"
                :data="depTableData"
                row-key="id"
                default-expand-all
                :highlight-current-row="true"
                :tree-props="{children: 'children'}"
                border
              >
                <el-table-column prop="name" label="名称" />
                <el-table-column align="center" label="操作" width="240">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handlePost(scope.row)">职位</el-button>
                    <el-button v-if="RP(['sys:dep:edit'])" type="primary" size="mini" @click="handleDepEdit(scope.row)">编辑</el-button>
                    <el-button v-if="RP(['sys:dep:del'])" type="danger" size="mini" @click="handleDelete(scope.row,'dep')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-card>
        </el-col>
      </transition>
      <transition name="lqTran">
        <el-col v-if="rightShow" :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>职位</span>
              <el-button type="danger" icon="el-icon-close" style="float: right;margin-left: 10px;" @click="handleCloseRight" />
              <el-button v-if="RP(['sys:post:add'])" type="primary" icon="el-icon-edit" style="float: right;" @click="handleCreate">添加</el-button>
            </div>
            <el-scrollbar class="custom-scrollbar" wrap-class="scrollbar-wrapper">
              <el-table ref="tableData" :data="tableData" row-key="id" border>
                <el-table-column prop="name" align="center" label="名称" />
                <el-table-column align="center" label="操作" width="240">
                  <template slot-scope="scope">
                    <el-button v-if="RP(['sys:post:edit'])" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button v-if="RP(['sys:post:del'])" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-card>
        </el-col>
      </transition>
    </el-row>

    <el-dialog :visible.sync="dialogDepVisible" :title="dialogType==='edit' ? '编辑部门' : '新增部门'" width="35%" @close="closeDialogFun('saveDepForm')">
      <el-form
        ref="saveDepForm"
        :model="saveDepForm"
        :rules="rules"
        label-position="left"
        width="35%"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="saveDepForm.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="所属机构" prop="orgId">
          <user-Select v-model="saveDepForm.orgId" :options="organization" label="name" @selectVal="selectOrg" />
        </el-form-item>
        <el-form-item label="上级部门">
          <user-Select v-model="saveDepForm.pid" :disabled="depDisabled" :options="depOption" label="name" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmData">确定</el-button>
        <el-button type="danger" @click="dialogDepVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '编辑职位' : '新增职位'" width="35%" @close="closeDialogFun('saveForm')">
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="saveForm.name" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <user-Select v-model="saveForm.deptId" :options="depTableData" label="name" :disabled="true" />
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
  name: '',
  deptId: null
};
const defaultDepData = {
  id: null,
  pid: null,
  orgId: null,
  name: ''
};

export default {
  name: 'DepPost',
  data() {
    return {
      saveDepForm: Object.assign({}, defaultDepData),
      saveForm: Object.assign({}, defaultData),
      leftWidth: 24,
      rightShow: false,
      rightID: null,
      filterForm: {
        size: 10,
        total: 1,
        current: 1,
        name: null
      },
      depTableData: [],
      depOption: [],
      depDisabled: true,
      dialogVisible: false,
      dialogDepVisible: false,
      dialogType: 'add',
      tableData: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        orgId: [{ required: true, message: '请选择机构', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight', 'organization'])
  },
  async mounted() {
    this.getDepTableData();
  },
  methods: {
    rolesPermission,

    selectOrg(node) {
      if (node.id) {
        get('/api/system/auth/dept/tree?orgId=' + node.id).then(res => {
          this.depOption = res.data;
          this.depDisabled = false;
          this.saveForm.pid = null;
          this.$nextTick(() => {
            res.loading.close();
          });
        });
      } else {
        this.depOption.length = 0;
        this.depDisabled = true;
        this.saveForm.pid = null;
      }
    },
    handleCurrentChange(page) {
      this.filterForm.current = page;
      this.getDepTableData();
    },
    handleFilter() {},
    handleCreate() {
      this.saveForm = Object.assign({}, defaultData);
      this.saveForm.deptId = this.rightID;
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.saveForm = deepClone(row);
      this.dialogVisible = true;
    },
    handleDepCreate() {
      this.saveDepForm = Object.assign({}, defaultDepData);
      this.dialogDepVisible = true;
      this.$nextTick(() => {
        this.$refs.saveDepForm.clearValidate();
      });
    },
    handlePost(row) {
      this.rightID = row.id;
      this.leftWidth = 12;
      this.rightShow = true;
      this.getPostTableData(row.id);
    },
    handleCloseRight() {
      this.rightShow = false;
      setTimeout(() => {
        this.leftWidth = 24;
      }, 500);
    },
    confirmData() {
      let name = 'saveForm';
      let url = '/api/system/auth/job/save';
      if (this.dialogDepVisible) {
        name = 'saveDepForm';
        url = '/api/system/auth/dept/save';
        if (!this[name].pid) {
          this[name].pid = 0;
        }
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          post(url, this[name]).then(res => {
            if (this.dialogDepVisible) {
              this.dialogDepVisible = false;
              this.getDepTableData();
            } else {
              this.dialogVisible = false;
              this.getPostTableData(this.rightID);
            }
          });
        }
      });
    },
    handleDepEdit(row) {
      this.saveDepForm = deepClone(row);
      if (!this.saveDepForm.pid) this.saveDepForm.pid = null;
      this.dialogDepVisible = true;
    },
    handleDelete(row, type) {
      let url = '/api/system/auth/job/remove/';
      if (type === 'dep') url = '/api/system/auth/dept/remove/';
      delMessage(url + row.id).then(res => {
        if (res) {
          if (type === 'dep') {
            this.getDepTableData();
          } else {
            this.getPostTableData(this.rightID);
          }
        }
      });
    },
    searchHandle() {
      this.filterForm.current = 1;
      this.getDepTableData();
    },
    getDepTableData() {
      get('/api/system/auth/dept/tree', this.filterForm).then(res => {
        this.depTableData = res.data;
        this.filterForm.total = res.data.total;
        this.$nextTick(() => {
          res.loading.close();
        });
      });
    },
    getPostTableData(id) {
      get('/api/system/auth/job/list/dept/' + id).then(res => {
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
