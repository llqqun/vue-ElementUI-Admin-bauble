<template>
  <div class="app-container">
    <el-row class="filter-container">
      <el-input
        v-model="filterForm.name"
        placeholder="搜索内容"
        style="width: 200px;"
        clearable
        class="filter-item"
      />
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="searchHandle"
      >搜索</el-button>
      <router-link :to="'/system/taskLog'">
        <el-button type="primary" size="small" icon="el-icon-edit-outline">日志</el-button>
      </router-link>
      <el-button type="primary" size="small" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
    </el-row>

    <el-row>
      <el-table
        ref="tableData"
        :data="tableData"
        row-key="id"
        border
        :max-height="tableHeight"
        :highlight-current-row="true"
        @select="checkboxSelect"
        @select-all="checkboxSelect"
      >
        <el-table-column fixed type="selection" width="55" align="center" />
        <el-table-column fixed prop="jobName" label="任务名称" min-width="120" align="center" />
        <el-table-column prop="invokeTarget" label="调用目标" :show-overflow-tooltip="true" min-width="150" align="center" />
        <el-table-column prop="cronExpression" label="cron执行表达式" min-width="150" align="center" />
        <el-table-column label="执行策略" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.misfirePolicy | misstatusFil }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              style="display: block"
              :active-value="1"
              :inactive-value="0"
              @click.native="setStatus(scope.row,scope.$index)"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" min-width="250">
          <template slot-scope="scope">
            <el-button v-if="RP(['ent:drafts:edit'])" type="primary" style="margin-left: 8px;" size="mini" @click="statusTask(scope.row)">立刻执行</el-button>
            <el-button v-if="RP(['ent:drafts:edit'])" type="primary" style="margin-left: 8px;" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="RP(['ent:drafts:del'])" type="danger" style="margin-left: 8px;" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="saveForm.jobName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="调用方法" prop="invokeTarget">
          <el-input v-model="saveForm.invokeTarget" placeholder="请输入调用目标字符串" />
        </el-form-item>
        <el-form-item label="执行表达式" prop="cronExpression">
          <el-input v-model="saveForm.cronExpression" placeholder="请输入cron执行表达式" />
        </el-form-item>
        <el-form-item label="执行策略">
          <el-radio-group v-model="saveForm.misfirePolicy" size="medium">
            <el-radio-button label="1">立即执行</el-radio-button>
            <el-radio-button label="2">执行一次</el-radio-button>
            <el-radio-button label="3">放弃执行</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <template>
            <el-radio v-model="saveForm.status" :label="0">暂停</el-radio>
            <el-radio v-model="saveForm.status" :label="1">正常</el-radio>
          </template>
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
  'concurrent': 0,
  'cronExpression': '',
  'id': null,
  'invokeTarget': '',
  'jobGroup': '',
  'jobName': '',
  'misfirePolicy': '1',
  'status': 1
};
export default {
  name: 'TimeOut',
  filters: {
    misstatusFil(val) {
      const status = ['立即执行', '执行一次', '放弃执行'];
      return status[val - 1];
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
      deleteList: [],
      rules: {
        jobName: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        invokeTarget: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        cronExpression: [{ required: true, message: '请输入内容', trigger: 'blur' }]
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
      get('/api/task/page', this.filterForm).then(res => {
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
    confirmData() {
      this.$refs.saveForm.validate(vali => {
        if (vali) {
          post('/api/task/save', this.saveForm).then(res => {
            this.dialogVisible = false;
            this.getTableData();
          });
        }
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
          await post('/api/task/delete/batch', {
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
      delMessage('/api/task/delete/' + row.id).then(res => {
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
    setStatus(row, index) {
      this.$confirm('您确定要这样操作吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '努力加载中....',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        post('/api/task/update/status', { id: row.id, status: row.status }).then(() => {
          loading.close();
        }).catch(() => {
          loading.close();
        });
      }).catch(() => {
        this.tableData[index].status = row.status ? 0 : 1;
      });
    },
    statusTask(row) {
      const task = this.$loading({
        lock: true,
        text: '努力执行中....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
      get('/api/task/run/' + row.id).then(() => {
        task.close();
      });
    }
  }
};
</script>

<style scoped>

</style>
