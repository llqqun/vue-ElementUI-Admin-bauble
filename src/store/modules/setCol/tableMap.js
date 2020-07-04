export default [
  { field: 'name', title: '姓名', width: 120, formType: 'input', showType: 'table,colForm' },
  { field: 'mobil', title: '手机号', width: 120, formType: 'input', showOverflowTooltip: true, showType: 'table,colForm' },
  { field: 'idCard', title: '身份证号', width: 150, formType: 'input', showOverflowTooltip: true, showType: 'colForm' },
  { field: 'address', title: '地址', width: 150, formType: 'input', showOverflowTooltip: true, showType: 'colForm' },
  { field: 'sex', title: '性别', width: 60, formType: 'select', showType: 'table,colForm', status: (key = 0) => { const status = ['女', '男']; return status[key]; }, selectData: [{ id: 0, label: '女' }, { id: 1, label: '男' }], defaultVal: 1 },
  { field: 'birthday', title: '出生日期', width: 120, formType: 'date', showType: 'table,colForm' },
  { field: 'introduce', title: '个人介绍', width: 150, formType: 'textarea', showType: 'rowForm' },
  { field: 'status', title: '状态', width: 60, formType: 'switch', showType: 'table,colForm', option: { key1: '禁止', key2: '正常' }, defaultVal: 1, status: (key = 0) => { const status = ['禁止', '正常']; return status[key]; } }
];
