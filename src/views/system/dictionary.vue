<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="filterForm.name"
        class="filter-item"
        placeholder="搜索内容"
        style="width: 200px;"
        clearable
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="searchHandle"
      >搜索</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="leftWidth">
        <el-card
          class="box-card"
        >
          <div slot="header" class="header-title clearfix">
            <span>字典列表</span>
            <el-button v-if="RP(['sys:dict:add'])" type="primary" icon="el-icon-edit" style="float: right;" @click="handleCreate">添加</el-button>
          </div>
          <el-scrollbar class="custom-scrollbar" wrap-class="scrollbar-wrapper">
            <el-table
              ref="tableData"
              :data="tableData"
              row-key="id"
              border
              max-height="calc(100vh - 230px)"
              :highlight-current-row="true"
            >
              <el-table-column align="center" prop="code" label="编码" min-width="120" />
              <el-table-column align="center" prop="name" label="名称" min-width="120" />
              <el-table-column align="center" prop="remark" label="说明" min-width="150" />
              <el-table-column align="center" label="操作" min-width="240" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleLook(scope.row)">查看</el-button>
                  <el-button v-if="RP(['sys:dict:edit'])" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button v-if="RP(['sys:dict:del'])" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-card>
      </el-col>
      <transition name="lqTran">
        <el-col v-if="show_resource" :span="12">
          <el-card class="box-card">
            <div slot="header" class="header-title clearfix">
              <span>字典内容</span>
              <el-button type="danger" icon="el-icon-close" style="float: right;" @click="handleCloseRight" />
              <el-button v-if="RP(['sys:dict:cont:add'])" type="primary" style="float: right;margin-right: 10px;" @click="rightCreate">添加</el-button>
            </div>
            <el-scrollbar wrap-class="scrollbar-wrapper" class="custom-scrollbar">
              <el-table
                ref="tableData"
                :data="rightTableData"
                row-key="id"
                border
                max-height="calc(100vh - 230px)"
              >
                <el-table-column align="center" prop="label" label="字典标签" min-width="120" />
                <el-table-column align="center" prop="value" label="字典键值" min-width="100" />
                <el-table-column align="center" prop="alias" label="字典编码" min-width="150" show-overflow-tooltip/>
                <el-table-column align="center" prop="sort" label="排序号" min-width="60" />
                <el-table-column align="center" label="操作" min-width="160" fixed="right">
                  <template slot-scope="scope">
                    <el-button v-if="RP(['sys:dict:cont:edit'])" type="primary" size="mini" @click="rightEdit(scope.row)">编辑</el-button>
                    <el-button v-if="RP(['sys:dict:cont:del'])" type="danger" size="mini" @click="rightDelete(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-card>
        </el-col>
      </transition>
    </el-row>

    <div class="footer-page">
      <el-pagination
        :current-page="filterForm.current"
        :page-size="filterForm.size"
        :hide-on-single-page="false"
        :page-sizes="[25, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filterForm.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :title="dialogType==='edit' ? '编辑': '新增'"
      width="40%"
      @close="closeDialogFun('saveForm')"
    >
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"

        label-position="left"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model="saveForm.code" placeholder="" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="saveForm.name" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="saveForm.remark" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmData">确定</el-button>
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogRightVisible"
      :title="dialogType==='edit' ? '编辑': '新增'"
      width="40%"
      @close="closeDialogFun('saveForm')"
    >
      <el-form
        ref="saveForm"
        :model="saveRightForm"
        :rules="rules"

        label-position="left"
      >
        <el-form-item label="字典编码">
          <el-input v-model="saveRightForm.alias" />
        </el-form-item>
        <el-form-item label="字典标签">
          <el-input v-model="saveRightForm.label" placeholder="" />
        </el-form-item>
        <el-form-item label="字典键值">
          <el-input v-model="saveRightForm.value" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="saveRightForm.sort" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="confirmRightData">确定</el-button>
        <el-button type="danger" @click="dialogRightVisible=false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { get, post, deleteData } from '@/api/common';
import { delMessage } from '@/utils/common';
import rolesPermission from '@/utils/permission';
import { deepClone } from '@/utils';

const defaultData = {
  'code': '',
  'id': null,
  'name': '',
  'remark': '',
  'status': 0
};
const defaultRightData = {
  'alias': '',
  'dictCode': '',
  'dictId': '',
  'id': null,
  'label': '',
  'sort': 0,
  'value': ''
};
export default {
  name: 'Dictionary',
  data() {
    return {
      filterForm: {
        name: '',
        size: 25,
        current: 1,
        total: 0
      },
      rightFilter: {
        alias: '',
        dictId: null,
        label: '' },
      show_resource: false,
      leftWidth: 24,
      tableData: [],
      rightTableData: [],
      saveForm: Object.assign({}, defaultData),
      saveRightForm: Object.assign({}, defaultRightData),
      dialogVisible: false,
      dialogRightVisible: false,
      dialogType: 'add',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    rolesPermission,

    searchHandle() {
      this.filterForm.current = 1;
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      get('/api/sys/dict/page', this.filterForm).then(res => {
        this.tableData = res.data.records;
        this.filterForm.total = res.data.total;
        this.$nextTick(() => {
          res.loading.close();
        });
      }).catch(() => {
      });
    },
    handleCreate() {
      this.saveForm = Object.assign({}, defaultData);
      this.dialogType = 'add';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    handleEdit(node) {
      this.saveForm = deepClone(node);
      this.dialogType = 'edit';
      this.dialogVisible = true;
    },
    confirmData() {
      this.$refs['saveForm'].validate(valid => {
        if (valid) {
          post('/api/sys/dict/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.getTableData();
          });
        }
      });
    },
    handleDelete(row) {
      delMessage('/api/sys/dict/delete/' + row.id).then(res => {
        if (res) {
          if (this.tableData.length === 1) {
            this.filterForm.current =
              this.filterForm.current - 1 > 0 ? this.filterForm.current - 1 : 1;
          }
          this.getTableData();
        }
      });
    },
    handleLook(row) {
      this.rightFilter.dictId = row.id;
      defaultRightData.dictId = row.id;
      defaultRightData.dictCode = row.code;
      this.leftWidth = 12;
      this.show_resource = true;
      this.getRightTableData();
    },

    handleSizeChange(size) {
      this.filterForm.size = size;
      this.getTableData();
    },
    handleCurrentChange(current) {
      this.filterForm.current = current;
      this.getTableData();
    },

    getRightTableData() {
      get('/api/sys/dict/detail/list', this.rightFilter).then(res => {
        this.rightTableData = res.data;
        this.$nextTick(() => {
          res.loading.close();
        });
      }).catch(() => {
      });
    },
    handleCloseRight() {
      this.show_resource = false;
      setTimeout(() => {
        this.leftWidth = 24;
      }, 500);
    },
    rightCreate() {
      this.saveRightForm = Object.assign({}, defaultRightData);
      this.dialogType = 'add';
      this.dialogRightVisible = true;
    },
    rightEdit(node) {
      this.saveRightForm = deepClone(node.row);
      this.dialogType = 'edit';
      this.dialogRightVisible = true;
    },
    confirmRightData() {
      this.$refs['saveForm'].validate(valid => {
        if (valid) {
          post('/api/sys/dict/detail/save', this.saveRightForm).then(res => {
            this.dialogRightVisible = false;
            this.getRightTableData();
          }).catch(() => {
          });
        }
      });
    },
    rightDelete(node) {
      this.$confirm('您确定要删除这条数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteData('/api/sys/dict/detail/remove/' + node.row.id).then(
            () => {
              this.getRightTableData();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          );
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
.app-container{
  .header-title{
    line-height: 33px;
  }
  .custom-scrollbar{
    height: calc(100vh - 330px);
  }
  >>> .el-table .warning-row {
    background: oldlace;
  }
}
</style>
