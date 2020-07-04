<template>
  <div class="app-container">
    <el-row class="filter-container">
      <el-button type="primary" icon="el-icon-search" @click="filterDrawer = true">搜索</el-button>
      <el-button type="primary" size="small" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
    </el-row>

    <el-row>
      <el-table
        ref="tableTem"
        :data="tableTem.data"
        row-key="id"
        border
        :max-height="tableHeight - 100"
        :highlight-current-row="true"
        @row-dblclick="lookData"
        @select="checkboxSelect"
        @select-all="checkboxSelect"
      >
        <el-table-column fixed type="selection" width="55" align="center" />
        <template v-for="(item,index) in tableTem.col">
          <el-table-column
            v-if="item.showType.indexOf('table') !== -1"
            :key="index"
            :prop="item.field"
            :label="item.title"
            :min-width="item.width"
            show-overflow-tooltip
            align="center"
            :fixed="index === 0"
          >
            <template slot-scope="scope">
              <span v-if="item.status">{{ item.status(scope.row[item.field]) }}</span>
              <span v-else>{{ scope.row[item.field] }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column v-if="tableTem.data.length && btnPermission[btnPermission.length-1]" :width="btnPermission[btnPermission.length-1]*90" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="btnPermission[0]" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="btnPermission[1]" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="footer-page">
      <el-pagination
        :total="filterForm.total"
        :hide-on-single-page="false"
        :current-page="filterForm.current"
        :page-size="filterForm.size"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[25, 50, 100, 200]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <el-drawer
      :with-header="false"
      custom-class="filter-drawer"
      direction="ttb"
      :modal="false"
      :visible.sync="filterDrawer"
      :append-to-body="false"
    >
      <div class="filter-container">
        <div class="filter-scope">
          <span>手机号:</span>
          <el-input v-model="filterForm.mobile" placeholder="搜索手机号" clearable class="filter-item" />
        </div>
      </div>
      <div style="margin: 10px auto;text-align: center;">
        <el-button type="primary" icon="el-icon-search" class="filter-btn" @click="searchHandle">确定</el-button>
        <el-button type="warning" icon="el-icon-refresh" class="filter-btn" @click="resetFilter">重置</el-button>
      </div>
    </el-drawer>

    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="custom-form-mode"
      :title="dialogType==='edit'?'编辑':'新增'"
      width="40%"
      top="0"
      :close-on-click-modal="false"
      @close="closeDialogFun('saveForm')"
    >
      <el-scrollbar wrap-class="scrollbar-wrapper" class="el-scrollbar-minx">
        <el-form
          ref="saveForm"
          :model="saveForm"
          :rules="rules"
          :inline="true"
          label-width="80px"
          label-position="left"
        >
          <template v-for="(item, index) in tableTem.col">
            <el-form-item
              v-if="item.showType.includes('colForm')"
              :key="index"
              class="col-form-item"
              :label="item.title"
              :prop="item.field"
            >
              <template v-if="item.title.length>=5" v-slot:label>
                <el-tooltip effect="dark" :content="item.title" placement="top">
                  <span>{{ item.title }}</span>
                </el-tooltip>
              </template>
              <template v-slot>
                <el-input v-if="item.formType === 'input'" v-model="saveForm[item.field]" :disabled="lookDialog" />
                <el-date-picker
                  v-else-if="item.formType === 'date'"
                  v-model="saveForm[item.field]"
                  :disabled="lookDialog"
                  type="date"
                  :picker-options="pickerOptions"
                  placeholder="选择还款日期"
                />
                <user-Select
                  v-else-if="item.formType === 'select'"
                  v-model="saveForm[item.field]"
                  :disabled="lookDialog"
                  placeholder="请选择"
                  :options="item.selectData"
                />
                <el-switch
                  v-else-if="item.formType === 'switch'"
                  v-model="saveForm[item.field]"
                  :active-text="item.option.key2"
                  :inactive-text="item.option.key1"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
                <el-input
                  v-else-if="item.formType === 'textarea'"
                  type="textarea"
                  v-model="saveForm[item.field]" />
              </template>
            </el-form-item>
            <el-form-item
              v-if="item.showType.includes('rowForm')"
              :key="index"
              class="row-form-item"
              :label="item.title"
              :prop="item.field"
            >
              <template v-if="item.title.length>=5" v-slot:label>
                <el-tooltip effect="dark" :content="item.title" placement="top">
                  <span>{{ item.title }}</span>
                </el-tooltip>
              </template>
              <template v-slot>
                <el-input
                  v-if="item.formType === 'textarea'"
                  v-model="saveForm[item.field]"
                  :rows="3"
                  type="textarea" />
              </template>
            </el-form-item>
          </template>
        </el-form>
      </el-scrollbar>
      <div class="el-scrollbar-footer">
        <el-button type="primary" @click="confirmData">确定</el-button>
        <el-button type="info" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { get, post } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone, forEachRen } from '@/utils';

const defaultData = {};
export default {
  name: 'Table1',
  data() {
    return {
      filterDrawer: false,
      lookDialog: false,
      btnPermission: ['pro:table:edit', 'pro:table:del', 0],
      tableTem: {
        col: [],
        data: []
      },
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      },
      filterForm: {
        size: 25,
        total: 1,
        current: 1,
        name: null
      },
      saveForm: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'add',
      deleteList: [],
      rules: {
        name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight', 'tableColTemplate'])
  },
  created() {
    this.tableTem.col = this.tableColTemplate['tableMap'];
    this.tableTem.col.forEach(item => {
      defaultData[item.field] = item.defaultVal || null;
    });
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    lookData(row) {
      this.lookDialog = true;
      this.saveForm = deepClone(row);
      this.dialogType = '查看';
      this.dialogVisible = true;
    },
    searchHandle() {
      this.filterForm.current = 1;
      this.getTableData();
    },
    resetFilter() {
      this.filterForm = {
        size: 25,
        total: 1,
        current: 1,
        name: null
      };
    },
    getTableData() {
      get('/table1/list', this.filterForm).then(res => {
        this.tableTem.data = res.data.records;
        this.filterForm.total = res.data.total;
      }).catch(() => {
      });
    },
    handleCurrentChange(page) {
      this.filterForm.current = page;
      this.getTableData();
    },
    handleSizeChange(size) {
      this.filterForm.size = size;
      this.getTableData();
    },
    confirmData() {
      this.$refs.saveForm.validate(valid => {
        if (valid) {
          post('/table/save', this.saveForm).then(res => {
            this.$message.success(res.message);
            this.dialogVisible = false;
          });
        }
      });
    },
    handleCreate() {
      this.lookDialog = false;
      this.saveForm = Object.assign({}, defaultData);
      this.dialogType = 'add';
      this.dialogVisible = true;
    },
    batchDelete() {
      if (!this.deleteList.length) {
        return this.$message.error('请先选择数据!');
      }
      const delList = forEachRen(this.deleteList, 'idCard');
      const _this = this;
      this.$confirm('您确定要删除这些数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await post('/delete/batch', {
            idList: delList
          }).then(() => {
            if (delList.length === this.tableTem.data.length) {
              this.filterForm.current =
                  this.filterForm.current - 1 > 0 ? this.filterForm.current - 1 : 1;
            }
            _this.getTableData();
            this.deleteList.length = 0;
            _this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
        .catch(() => {
          return false;
        });
    },
    handleEdit(row) {
      this.lookDialog = false;
      this.saveForm = deepClone(row);
      this.dialogType = 'edit';
      this.dialogVisible = true;
    },
    handleDelete(row) {
      delMessage('/mock/template/remove/' + row.id).then(res => {
        if (res) {
          if (this.tableTem.data.length === 1) {
            this.filterForm.current =
                this.filterForm.current - 1 > 0 ? this.filterForm.current - 1 : 1;
          }
          this.getTableData();
        }
      });
    },
    checkboxSelect(select) {
      this.deleteList = select;
    }
  }
};
</script>

<style scoped>

</style>
