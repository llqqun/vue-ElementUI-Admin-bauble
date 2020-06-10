const getDefaultState = () => {
  return {
    tableTemplate: {
      table1Map: [
        { field: 'name', title: '姓名', width: 120, formType: 'input', showType: 'table,form' },
        { field: 'mobil', title: '手机号', width: 150, formType: 'input', showOverflowTooltip: true, showType: 'table,form' },
        { field: 'idCard', title: '身份证号', width: 150, formType: 'input', showOverflowTooltip: true, type: 'input', showType: 'form' },
        { field: 'address', title: '地址', width: 150, formType: 'input', showOverflowTooltip: true, type: 'input', showType: 'form' },
        { field: 'sex', title: '性别', width: 60, formType: 'select', type: 'select', showType: 'table,form', status: (key = 0) => { const status = ['女', '男']; return status[key]; }, selectData: [{ id: 0, label: '女' }, { id: 1, label: '男' }] },
        { field: 'status', title: '状态', width: 60, formType: 'select', type: 'select', showType: 'table,form', status: (key = 0) => { const status = ['正常', '禁止']; return status[key]; }, selectData: [{ id: 0, label: '禁止' }, { id: 1, label: '正常' }] },
        { field: 'birthday', title: '出生日期', width: 80, formType: 'date', showType: 'table,form' }
      ]
    }
  };
};
const state = getDefaultState();

export default {
  namespaced: true,
  state
};
