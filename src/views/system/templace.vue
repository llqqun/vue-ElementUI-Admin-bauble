<template>
  <div class="app-container">
    <el-row class="filter-container">
<!--      <el-input-->
<!--        v-model="filterForm.name"-->
<!--        placeholder="搜索内容"-->
<!--        style="width: 200px;"-->
<!--        clearable-->
<!--        class="filter-item"-->
<!--      />-->
<!--      <el-button-->
<!--        size="small"-->
<!--        type="primary"-->
<!--        icon="el-icon-search"-->
<!--        @click="searchHandle"-->
<!--      >搜索</el-button>-->
      <div style="margin: 10px;">
        <el-input v-model="filterForm.name" placeholder="请输入内容" class="input-with-select">
          <el-select slot="prepend" v-model="search" placeholder="请选择" style="min-width: 120px;">
            <el-option label="用户名" :value="1"></el-option>
            <el-option label="卡号" :value="2"></el-option>
            <el-option label="用户电话" :value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-button v-if="RP(['ent:drafts:add'])" type="primary" size="small" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button v-if="RP(['ent:drafts:batchDel'])" type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
    </el-row>

    <el-row>
      <!--      <el-table-->
      <!--        ref="tableData"-->
      <!--        :data="tableData"-->
      <!--        row-key="id"-->
      <!--        border-->
      <!--        :max-height="tableHeight"-->
      <!--        :highlight-current-row="true"-->
      <!--        @select="checkboxSelect"-->
      <!--        @select-all="checkboxSelect"-->
      <!--      >-->
      <!--        <el-table-column fixed type="selection" width="55" align="center" />-->
      <!--        <el-table-column fixed prop="name" label="名称" min-width="120" align="center" />-->
      <!--        <el-table-column prop="content" label="内容" :show-overflow-tooltip="true" min-width="150" align="center" />-->
      <!--        <el-table-column prop="display_time" label="时间" min-width="150" align="center" />-->
      <!--        <el-table-column label="状态" min-width="80" align="center">-->
      <!--          <template slot-scope="scope">-->
      <!--            <span>{{ scope.row.status | statusFil }}</span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column fixed="right" align="center" label="操作" min-width="220">-->
      <!--          <template slot-scope="scope">-->
      <!--            <el-button v-if="RP(['ent:drafts:edit'])" type="primary" style="margin-left: 8px;" size="mini" @click="handleEdit(scope.row)">编辑</el-button>-->
      <!--            <el-button v-if="RP(['ent:drafts:del'])" type="danger" style="margin-left: 8px;" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
    </el-row>
    <el-table
      :data="tableData1"
      :span-method="arraySpanMethod"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="贷款品种"
        align="center"
        width="180"
      />
      <el-table-column
        prop="name"
        align="center"
        label="逾期天数"
      />
      <el-table-column
        prop="amount1"
        align="center"
        label="回收率"
      />
      <el-table-column
        prop="amount2"
        align="center"
        label="代理费用限额"
      />
    </el-table>
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

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogType==='add'?'新增':'编辑'"
      width="40%"
      @close="closeDialogFun('saveForm')"
    >
      <el-form
        ref="saveForm"
        :model="saveForm"
        :rules="rules"

        label-position="left"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="saveForm.name" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="saveForm.content" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="saveForm.display_time"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
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
import { mapGetters } from 'vuex';
import { get, post } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone, forEachRen } from '@/utils';

const defaultData = {
  'display_time': '',
  'id': null,
  'name': '',
  'content': ''
};
export default {
  name: 'Templace',
  filters: {
    statusFil(val) {
      const status = ['状态1', '状态2', '状态3'];
      return status[val];
    }
  },
  data() {
    return {
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
      tableData: [],
      search: '',
      tableData1: [
        {
          id: '信用卡',
          name: '逾期180天内',
          amount1: '20%',
          amount2: '3.2',
          Count: { id: [8, 1], name: [3, 1] }
        }, {
          id: '信用卡',
          name: '逾期180天内',
          amount1: '15%',
          amount2: '4.43',
          Count: { id: [0, 0], name: [0, 0] }
        }, {
          id: '信用卡',
          name: '逾期180天内',
          amount1: '32%',
          amount2: '1.9',
          Count: { id: [0, 0], name: [0, 0] }
        }, {
          id: '信用卡',
          name: '逾期180天-360天',
          amount1: '20%',
          amount2: '2.2',
          Count: { id: [0, 0], name: [3, 1] }
        }, {
          id: '信用卡',
          name: '逾期180天-360天',
          amount1: '15%',
          amount2: '4.1',
          Count: { id: [0, 0], name: [0, 0] }
        }, {
          id: '信用卡',
          name: '逾期180天-360天',
          amount1: '25%',
          amount2: '4.1',
          Count: { id: [0, 0], name: [0, 0] }
        }, {
          id: '信用卡',
          name: '360天',
          amount1: '18%',
          amount2: '4.1',
          Count: { id: [0, 0], name: [1, 2], amount1: [0, 0] }
        }, {
          id: '信用卡',
          name: '已核销',
          amount1: '15%',
          amount2: '4.1',
          Count: { id: [0, 0], name: [1, 2], amount1: [0, 0] }
        }],
      deleteList: [],
      rules: {
        name: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight'])
  },
  mounted() {
    this.getTableData();
  },
  methods: {

    searchHandle() {
      this.filterForm.current = 1;
      this.getTableData();
    },
    getTableData() {
      get('/mock/template/list', this.filterForm).then(res => {
        this.tableData = res.data.records;
        this.filterForm.total = res.data.total;
        this.filterForm.size = res.data.size;
        this.$nextTick(() => {
          res.loading.close();
        });
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
    confirmData() {},
    handleCreate() {
      this.saveForm = Object.assign({}, defaultData);
      this.dialogType = 'add';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    batchDelete() {
      if (!this.deleteList.length) {
        return this.$message.error('请先选择数据!');
      }
      const delList = forEachRen(this.deleteList, 'id');
      const _this = this;
      this.$confirm('您确定要删除这些数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await post('/mock/delete/batch', {
            idList: delList
          }).then(() => {
            if (delList.length === this.tableData.length) {
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
      this.saveForm = deepClone(row);
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.saveForm.clearValidate();
      });
    },
    handleDelete(row) {
      delMessage('/mock/template/remove/' + row.id).then(res => {
        if (res) {
          if (this.tableData.length === 1) {
            this.filterForm.current =
              this.filterForm.current - 1 > 0 ? this.filterForm.current - 1 : 1;
          }
          this.getTableData();
        }
      });
    },
    checkboxSelect(select) {
      this.deleteList = select;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row['Count']) {
        const obj = row['Count'];
        const arr = Object.keys(row['Count']);
        if (arr.includes(column.property)) {
          return obj[column.property];
        }
        if (!Object.keys(row).includes(column.property)) {
          return [0, 0];
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
