<template>
  <div class="app-container">
    <el-row class="filter-container">
      <el-input
        v-model="filterForm.jobName"
        placeholder="搜索任务名称"
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
      <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="clearLog">清空日志</el-button>
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
        <el-table-column fixed prop="jobName" label="任务名称" min-width="150" :show-overflow-tooltip="true" align="center" />
        <el-table-column prop="jobMessage" label="任务信息" :show-overflow-tooltip="true" min-width="200" align="center" />
        <el-table-column prop="invokeTarget" label="调用目标" :show-overflow-tooltip="true" min-width="200" align="center" />
        <el-table-column prop="jobGroup" label="任务分组" min-width="120" align="center" />
        <el-table-column prop="startTime" label="开始时间" min-width="150" align="center" />
        <el-table-column prop="endTime" label="结束时间" min-width="150" align="center" />
        <el-table-column label="状态" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFil }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" min-width="100">
          <template slot-scope="scope">
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

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { get, post, deleteData } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone, forEachRen } from '@/utils';

const defaultData = {
  'display_time': '',
  'id': null,
  'name': '',
  'content': ''
};
export default {
  name: 'TaskLog',
  filters: {
    statusFil(val) {
      const status = ['暂停', '正常'];
      return status[val];
    }
  },
  data() {
    return {
      filterForm: {
        size: 25,
        total: 1,
        current: 1,
        jobName: null
      },
      saveForm: Object.assign({}, defaultData),
      tableData: [],
      deleteList: []
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
      get('/api/task/log/page', this.filterForm).then(res => {
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
          await post('/api/task/log/delete/batch', {
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
    clearLog() {
      this.$confirm('您确定要清空日志吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData('/api/task/log/clear').then(() => {
          this.$message.success('清除完成');
          this.getTableData();
        });
      });
    },
    handleDelete(row) {
      delMessage('/api/task/log/delete/' + row.id).then(res => {
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
    }
  }
};
</script>

<style scoped>

</style>
