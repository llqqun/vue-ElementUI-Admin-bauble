const Mock = require('mockjs');

const data = Mock.mock({
  'items|30': [{
    idCard: '@id',
    name: '@cname',
    'mobil|1': ['18775210879', '18775210999', '18775213561'],
    address: '@Region',
    introduce: '@paragraph',
    'sex|1': [0, 1],
    'status|1': [0, 1],
    birthday: '@datetime'
  }]
});

module.exports = [
  {
    url: '/table1/list',
    type: 'get',
    response: config => {
      const items = data.items;
      return {
        code: 200,
        data: {
          total: items.length,
          records: items
        }
      };
    }
  },
  {
    url: '/delete/batch',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: {},
        message: '成功'
      };
    }
  },
  {
    url: '/table/save',
    type: 'post',
    response: config => {
      return {
        code: 200,
        data: {},
        message: '保存成功'
      };
    }
  }
];
