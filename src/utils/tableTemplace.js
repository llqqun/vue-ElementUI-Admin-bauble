const tableTemp =
  { 'default': [
    { prop: 'id', label: '卡号', widthMin: 140 },
    { prop: 'name', label: '姓名', widthMin: 140 },
    { prop: 'mobile', label: '联系方式', widthMin: 140 }
  ],
  'menus': [
    { prop: 'name', label: '菜单名称', widthMin: 140, center: 'left' },
    { prop: 'path', label: '菜单路径', widthMin: 140, center: 'center' },
    { prop: 'alias', label: '菜单权限', widthMin: 140, center: 'center' },
    { prop: 'icon', label: '菜单图标', widthMin: 140, center: 'center' },
    { prop: 'sort', label: '排序', widthMin: 140, center: 'center' },
    { prop: 'type', label: '类型', widthMin: 140, center: 'center' }

  ],
  'loans': [
    { prop: 'iouNumber', label: '借据编号', widthMin: 140 },
    { prop: 'customerCardNo', label: '客户证件号码', widthMin: 140 },
    { prop: 'contractNo', label: '合同编号', widthMin: 140 }
  ]
  };
export default tableTemp;
