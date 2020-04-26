<!-- 资源管理 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search" class="filter-item" clearable size="mini" placeholder="输入名称搜索" />
      <el-button type="primary" @click="closeOrOpenExpand(true)">展开</el-button>
      <el-button type="primary" @click="closeOrOpenExpand(false)">折叠</el-button>
    </div>
    <el-scrollbar ref="scrollbar" wrap-class="scrollbar-wrapper" :style="{height:tableHeight + 50 + 'px'}">
      <el-table
        ref="tableData"
        :data="resourceTree.filter(data => !search || data.name.includes(search))"
        :highlight-current-row="true"
        default-expand-all
        border
        row-key="id"
      >
        <template v-for="(item,index) in tableColumns">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.widthMin"
            :align="item.center"
            show-overflow-tooltip
          />
        </template>
        <el-table-column align="center" label="操作" min-width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="auditContent(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" style="margin-left: 8px;" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script>
import { get, post } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone, editCopy } from '@/utils';
import rolesPermission from '@/utils/permission';
import { mapGetters } from 'vuex';
const defaultData = {
  id: null,
  pid: null,
  sort: 0,
  status: 1,
  type: 0,
  icon: '',
  name: '',
  alias: '',
  path: ''
};

export default {
  name: 'Resource',
  data() {
    return {
      temporary: null,
      search: '',
      resourceTree: [],
      tableColumns: [],
      filterText: '',
      saveForm: Object.assign({}, defaultData),
      saveType: 'add',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight']),
    controlleText: function() {
      return this.saveForm.type === 1 ? '按钮' : '菜单';
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.tableColumns = this.tableTem['menus'];
    this.getResourceTree();
    this.$nextTick(() => {
      this.setScrollTable('scrollbar', 'tableData');
    });
  },

  methods: {
    rolesPermission,
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    resetData() {
      this.saveForm = Object.assign({}, defaultData);
    },
    async onSubmit() {
      this.saveForm.pid = this.saveForm.pid || 0;
      await post('/api/system/auth/resource/save', this.saveForm).then(res => {
        if (this.saveType === 'add') {
          this.getResourceTree();
        } else {
          editCopy(this.temporary, this.saveForm);
          this.$nextTick(() => {
            res.loading.close();
          });
        }
        this.$message.success('提交成功');
      });
    },
    append(data) {
      this.saveType = 'add';
      this.saveForm = Object.assign({}, defaultData);
      this.saveForm.pid = data.id;
    },
    editTree(node, data) {
      this.temporary = data;
      this.saveType = 'edit';
      this.saveForm = deepClone(data);
      if (data.pid === 0) {
        this.saveForm.pid = null;
      }
    },
    remove(node, data) {
      delMessage('/api/system/auth/resource/remove/' + data.id).then(res => {
        if (res) {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
          res.loading.close();
        }
      });
    },
    closeOrOpenExpand(off) {
      this.resourceTree.filter(item => {
        this.$refs.tableData.toggleRowExpansion(item, off);
      });
    },
    getResourceTree() {
      get('/api/system/auth/resource/tree').then(res => {
        this.resourceTree = res.data;
      });
    }
  }
};
</script>
<style lang='scss' scoped>
/*.custom-tree-node {*/
/*  flex: 1;*/
/*  display: flex;*/
/*  align-items: center;*/
/*  justify-content: space-between;*/
/*  font-size: 14px;*/
/*  padding-right: 8px;*/
/*  button {*/
/*    font-size: 18px;*/
/*  }*/
/*  .right-btn button:hover{*/
/*    font-size: 24px;*/
/*  }*/
/*}*/
</style>
