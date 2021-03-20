<!-- 资源管理 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search" class="filter-item" clearable placeholder="输入菜单名称搜索" />
      <el-button type="primary" icon="el-icon-plus" @click="$refs.tableGrid.setAllTreeExpand(true)">全部展开</el-button>
      <el-button type="primary" icon="el-icon-minus" @click="$refs.tableGrid.clearTreeExpand()">全部折叠</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>

    <vxe-grid
      ref="tableGrid"
      class="vxe-table-lq"
      border
      resizable
      auto-resize
      keep-source
      :max-height="tableHeight - 50"
      show-overflow
      :edit-config="tableGrid.tableGrid"
      :columns="tableGrid.columns"
      :tree-config="{}"
      :data="tableGrid.data"
    >
      <template #buttonFun="{ row }">
        <vxe-button icon="el-icon-edit-outline" title="编辑" circle @click="handleEdit(row)" />
        <vxe-button icon="el-icon-delete" title="删除" circle @click="handleDelete(row)" />
      </template>
    </vxe-grid>

    <vxe-modal id="vxeModal1" v-model="dialogVisible" show-zoom width="600" @hide="closeDialogFun('saveForm')">
      <template v-slot:title>
        <span>{{ dialogType==='edit' ? '编辑&保存': '新增&保存' }}</span>
      </template>
      <template>
        <el-form ref="saveForm" label-width="100px" :model="saveForm" :rules="rules" class="custom-dialog-form">
          <el-form-item label="类型">
            <vxe-radio
              v-for="(item,index) in dict"
              :key="index"
              v-model="saveForm.type"
              name="radio"
              :label="item.value"
              :content="item.label"
            />
          </el-form-item>
          <el-form-item label="上级菜单">
            <user-Select v-model="saveForm.pid" :options="selectTree" match-keys="type" :filter-val="2" label="name" placeholder="请选择父级菜单" />
          </el-form-item>
          <el-form-item :label="controlleText + '名称'">
            <el-input v-model="saveForm.title" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item v-if="saveForm.type === 1" label="路由地址">
            <el-input v-model="saveForm.path" placeholder="" />
          </el-form-item>
          <el-form-item v-if="saveForm.type === 2" label="权限标识" field="alias" class="el-form-item-half">
            <el-input v-model="saveForm.alias" />
          </el-form-item>
          <el-form-item v-if="saveForm.type !== 2" label="图标">
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
          </el-form-item>
          <el-form-item :label="controlleText + '排序'" class="el-form-item-half">
            <vxe-input v-model="saveForm.sort" type="number" />
          </el-form-item>
          <el-form-item v-if="saveForm.type !== 2" label="是否外链" span="12" class="el-form-item-half">
            <el-radio v-model="saveForm.isFrame" :label="1">是</el-radio>
            <el-radio v-model="saveForm.isFrame" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item :label="controlleText + '状态'" class="el-form-item-half">
            <vxe-switch v-model="saveForm.status" :open-value="1" :close-value="0" open-label="启用" close-label="停用" />
          </el-form-item>
          <el-form-item label="显示状态" class="el-form-item-half">
            <vxe-switch v-model="saveForm.hidden" open-label="显示" :open-value="1" close-label="隐藏" :close-value="0" />
          </el-form-item>
          <el-form-item align="right">
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="info" @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import { getResourceList } from '@/api/system';
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
  hidden: 1,
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
      demo: 1,
      tableGrid: {
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: true
        },
        columns: [
          { field: 'name', title: '菜单名称', minWidth: 180, treeNode: true },
          { field: 'path', title: '菜单路径', editRender: { name: 'input' }, minWidth: 150 },
          { field: 'alias', title: '菜单权限', editRender: { name: 'input' }, minWidth: 100 },
          { field: 'icon', title: '菜单图标', minWidth: 100 },
          { field: 'type', title: '类型', editRender: { name: 'input' }, minWidth: 80 },
          { field: 'sort', title: '排序', editRender: { name: 'input' }, minWidth: 80 },
          { title: '操作', width: 160, showOverflow: true, slots: { default: 'buttonFun' }}
        ],
        data: []
      },
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
    // resourceTree: function(val) {
    //   this.selectTree = deepClone(val);
    //   this.tableTree = val;
    // },
    search: function(val) {
      const filterName = this.$XEUtils.toString(val).trim();
      if (filterName) {
        this.tableGrid.data = this.$XEUtils.searchTree(this.resourceTree, item => item['name'].indexOf(filterName) !== -1, { children: 'children' }, false);
      } else {
        this.tableGrid.data = this.resourceTree;
      }
      this.$nextTick(() => {
        this.$refs.tableGrid.setAllTreeExpand(true);
      });
    },
    'saveForm.type': {
      handler: function(val) {
        const type = ['目录', '菜单', '按钮'];
        this.controlleText = type[val];
      },
      deep: true
    }
  },
  created() {
    // this.tableGrid.maxHeight = this.tableHeight - 50;
  },
  mounted() {
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
        this.selectTree = this.resourceTree = this.tableGrid.data = res.data.list;
        this.$nextTick(() => {
          this.$refs.tableGrid.setAllTreeExpand(true);
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
