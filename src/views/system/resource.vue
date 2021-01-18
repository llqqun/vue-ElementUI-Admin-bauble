<!-- 资源管理 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search" class="filter-item" clearable placeholder="输入菜单名称搜索" />
      <el-button type="primary" icon="el-icon-plus" @click="$refs.xTree.setAllTreeExpansion(true)">全部展开</el-button>
      <el-button type="primary" icon="el-icon-minus" @click="$refs.xTree.clearTreeExpand()">全部折叠</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <vxe-table
      ref="xTree"
      class="vxe-table-lq"
      resizable
      border="full"
      tree-config
      highlight-hover-row
      :max-height="tableHeight - 43"
      :data="resourceTree"
    >
      <template v-for="(item,index) in tableColumns">
        <vxe-table-column
          v-if="!item.tempalateOff"
          :key="index"
          :field="item.prop"
          :title="item.label"
          :align="item.center"
          :min-width="item.widthMin"
          show-overflow="tooltip"
          :tree-node="!index"
        />
        <vxe-table-column
          v-else-if="item.tempalateOff === 'type'"
          :key="index"
          :field="item.prop"
          :title="item.label"
          :align="item.center"
          :min-width="item.widthMin"
          :formatter="formatMenusType"
          show-overflow="tooltip"
        />
      </template>
      <vxe-table-column title="操作" fixed="right" width="240" align="left">
        <template v-slot="{ row }">
          <el-button v-if="row.type !== 2" type="success" size="mini" @click.stop="handleAdd(row)">新增</el-button>
          <el-button type="primary" size="mini" @click.stop="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-modal id="vxeModal1" v-model="dialogVisible" width="600" @hide="closeDialogFun('saveForm')">
      <template v-slot:title>
        <span>{{ dialogType==='edit' ? '编辑&保存': '新增&保存' }}</span>
      </template>
      <template>
        <vxe-form ref="saveForm" title-width="80" :data="saveForm" :rules="rules" @submit="onSubmit">
          <vxe-form-item title="类型" span="24">
            <el-radio v-for="(item,index) in dict" :key="index" v-model="saveForm.type" :label="item.value">{{ item.label }}</el-radio>
          </vxe-form-item>
          <vxe-form-item title="上级菜单" span="24">
            <user-Select v-model="saveForm.pid" :options="selectTree" match-keys="type" :filter-val="2" label="name" placeholder="请选择父级菜单" />
          </vxe-form-item>
          <vxe-form-item :title="controlleText + '名称'" field="title" span="24">
            <vxe-input v-model="saveForm.title" placeholder="请输入名称" />
          </vxe-form-item>
          <vxe-form-item v-if="saveForm.type === 1" title="路由地址" span="24" field="path">
            <vxe-input v-model="saveForm.path" placeholder="" />
          </vxe-form-item>
          <vxe-form-item v-if="saveForm.type === 2" title="权限标识" field="alias" span="12">
            <vxe-input v-model="saveForm.alias" />
          </vxe-form-item>
          <vxe-form-item v-if="saveForm.type !== 2" title="图标" :span="24">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selectedIco" />
              <el-input slot="reference" v-model="saveForm.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="saveForm.icon"
                  slot="prefix"
                  :icon-class="saveForm.icon"
                  class="el-input__icon"
                  style="height: 32px;width: 16px;"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </vxe-form-item>
          <vxe-form-item :title="controlleText + '排序'" :span="12">
            <vxe-input v-model="saveForm.sort" type="number" />
          </vxe-form-item>
          <vxe-form-item v-if="saveForm.type !== 2" title="是否外链" span="12">
            <el-radio v-model="saveForm.isFrame" :label="1">是</el-radio>
            <el-radio v-model="saveForm.isFrame" :label="0">否</el-radio>
          </vxe-form-item>
          <vxe-form-item :title="controlleText + '状态'" span="12">
            <vxe-switch v-model="saveForm.status" on-label="启用" :on-value="1" off-label="停用" :off-value="0" />
          </vxe-form-item>
          <vxe-form-item title="显示状态" span="12">
            <vxe-switch v-model="saveForm.hidden" on-label="显示" :on-value="0" off-label="隐藏" :off-value="1" />
          </vxe-form-item>
          <vxe-form-item align="right" span="24">
            <vxe-button type="submit" status="success">提交</vxe-button>
            <vxe-button status="info" @click="dialogVisible = false">取消</vxe-button>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import { getResourceList, delResource, saveResource } from '@/api/system';
import { get } from '@/api/common';
import { delMessage } from '@/utils/common';
import { deepClone } from '@/utils';
import { mapGetters } from 'vuex';
import IconSelect from '@/components/IconSelect';

const defaultData = {
  id: null,
  pid: null,
  sort: 0,
  status: 1,
  hidden: 0,
  noComponent: false,
  type: 0,
  icon: '',
  name: '',
  alias: '',
  path: ''
};
export default {
  name: 'Resource',
  components: { IconSelect },
  data() {
    return {
      search: '',
      dict: [{ value: 0, label: '目录' }, { value: 1, label: '菜单' }, { value: 2, label: '按钮' }],
      resourceTree: [],
      tableTree: [],
      selectTree: [],
      tableColumns: [],
      dialogVisible: false,
      controlleText: '',
      saveForm: Object.assign({}, defaultData),
      dialogType: 'add',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rules: {
        title: [{ required: true, message: '名称不能为空' }],
        path: [{ required: true, message: '地址不能为空' }],
        alias: [{ required: true, message: '不能为空' }]
      }
    };
  },
  computed: {
    ...mapGetters(['tableHeight'])
  },
  watch: {
    resourceTree: function(val) {
      this.selectTree = deepClone(val);
      this.tableTree = val;
    },
    search: function() {
      const filterName = this.XEUtils.toString(this.search).trim();
      if (filterName) {
        this.tableTree = this.XEUtils.searchTree(this.resourceTree, item => item['title'].indexOf(filterName) !== -1, { children: 'children' });
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true);
        });
      } else {
        this.tableTree = this.resourceTree;
      }
    },
    'saveForm.type': {
      handler: function(val) {
        const type = ['目录', '菜单', '按钮'];
        this.controlleText = type[val];
      },
      deep: true
    }
  },
  mounted() {
    // this.getMenuDict();
    this.tableColumns = this.tableTem['menus'];
    this.getResourceTree();
  },
  methods: {
    formatMenusType({ cellValue }) {
      const type = ['目录', '菜单', '按钮'];
      return type[cellValue];
    },
    selectedIco(name) {
      this.saveForm.icon = name;
    },
    handleDelete(row) {
      delMessage('/api/system/auth/resource/remove/' + row.id).then(() => {
        this.getResourceTree();
      });
    },
    handleEdit(row) {
      this.dialogType = 'edit';
      this.saveForm = deepClone(row);
      if (row.pid === 0) {
        this.saveForm.pid = null;
      }
      console.log(this.saveForm);
      this.dialogVisible = true;
    },
    handleAdd(row) {
      this.dialogType = 'add';
      this.saveForm = deepClone(defaultData);
      if (row.id) this.saveForm.pid = row.id;
      this.dialogVisible = true;
    },
    async onSubmit() {
      this.saveForm.pid = this.saveForm.pid || 0;
      this.saveForm.noComponent = this.saveForm.type;
      console.log(this.saveForm);
      /* await post('/api/system/auth/resource/save', this.saveForm).then(res => {
        this.dialogVisible = false;
        this.getResourceTree();
      });*/
      this.$message.success('提交成功');
    },
    async getResourceTree() {
      getResourceList().then(res => {
        this.resourceTree = res.data.list;
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true);
        });
      });
    },
    getMenuDict() {
      getResourceList().then(res => {
        this.dict = res.data;
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
