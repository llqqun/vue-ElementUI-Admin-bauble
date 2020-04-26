<template>
  <div class="app-container">
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
        <el-table-column fixed prop="businessTypeName" label="操作名称" min-width="120" align="center" />
        <el-table-column prop="title" label="操作菜单" :show-overflow-tooltip="true" min-width="120" align="center" />
        <el-table-column prop="requestMethod" label="请求方式" :show-overflow-tooltip="true" min-width="120" align="center" />
        <el-table-column prop="requestIp" label="操作IP" :show-overflow-tooltip="true" min-width="120" align="center" />
        <el-table-column prop="operateTime" label="操作时间" min-width="150" align="center" />
        <el-table-column fixed="right" align="center" label="操作" min-width="220">
          <template slot-scope="scope">
            <el-button v-if="RP(['ent:drafts:edit'])" type="primary" style="margin-left: 8px;" size="mini" @click="handleLook(scope.row)">详情</el-button>
            <el-button v-if="RP(['ent:drafts:del'])" type="danger" style="margin-left: 8px;" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { get, post, deleteData } from '@/api/common';
import { delMessage } from '@/utils/common';
import { forEachRen } from '@/utils';

const defaultData = {
  'display_time': '',
  'id': null,
  'name': '',
  'content': ''
};
export default {
  name: 'SysLog',
  data() {
    return {
      filterForm: {
        size: 25,
        total: 1,
        current: 1
      },
      saveForm: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'add',
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
      get('/monitor/server/info', this.filterForm).then(res => {
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
    handleLook(row) {
      get('/api/system/monitor/operatelog/detail/' + row.id).then(res => {
        this.saveForm = res.data;
        this.dialogVisible = true;
        this.$nextTick(() => {
          res.loading.close();
        });
      });
    },
    handleDelete(row) {
      delMessage('/api/collect/record/delete/' + row.id).then(res => {
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
