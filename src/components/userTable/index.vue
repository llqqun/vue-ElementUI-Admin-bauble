<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" style="height:calc(100vh - 85px);">
    <el-table
      ref="tableData"
      :data="tableData"
      :highlight-current-row="true"
      border
      row-key="id"
    >
      <el-table-column v-if="checkON" type="selection" width="55" align="center" />
      <el-table-column
        v-for="(item,index) in tableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.widthMin"
        :align="item.center"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="操作" min-width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="auditContent(scope.row)">审核</el-button>
          <el-button type="danger" size="mini" style="margin-left: 8px;" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script>
import templace from './templace';
export default {
  name: 'UserTable',
  props: {
    checkON: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tableColumnOption: {
      type: [Array, String],
      required: true,
      default: function() {
        return [];
      }
    },
    handleOption: {
      type: Object
    }
  },
  data() {
    return {

    };
  },
  computed: {
    tableColumns: function() {
      if (Array.isArray(this.tableColumnOption) && this.tableColumnOption.length) {
        return this.tableColumnOption;
      } else if (typeof this.tableColumnOption === 'string') {
        return templace[this.tableColumnOption];
      } else {
        return [];
      }
    }
  }
};
</script>

<style scoped>

</style>
