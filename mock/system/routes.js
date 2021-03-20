const adminRoutes = [
  {
    'children': [
      {
        'hidden': 0,
        'icon': 'mentus',
        'id': 21,
        'name': '菜单管理',
        'noComponent': false,
        'path': 'resource',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'hidden': 0,
        'icon': 'roles',
        'id': 22,
        'name': '角色管理',
        'noComponent': false,
        'path': 'roles',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'hidden': 0,
        'icon': 'admin',
        'id': 23,
        'name': '用户管理',
        'noComponent': false,
        'path': 'admin',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'alias': '',
        'hidden': 0,
        'icon': 'example',
        'id': 106,
        'name': '系统配置',
        'noComponent': false,
        'path': 'configuration',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'alias': '',
        'hidden': 0,
        'icon': 'organization',
        'id': 127,
        'name': '组织机构',
        'noComponent': false,
        'path': 'organization',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'alias': '',
        'hidden': 0,
        'icon': 'dashboard',
        'id': 130,
        'name': '数据字典',
        'noComponent': false,
        'path': 'dictionary',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'alias': '',
        'hidden': 0,
        'icon': 'timeOut',
        'id': 166,
        'name': '定时任务',
        'noComponent': false,
        'path': 'timeOut',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      },
      {
        'alias': '',
        'hidden': 1,
        'icon': 'timeOut',
        'id': 167,
        'name': '定时任务日志',
        'noComponent': false,
        'path': 'taskLog',
        'pid': 19,
        'sort': 0,
        'status': 1,
        'type': 0
      }
    ],
    'hasChild': true,
    'hidden': 0,
    'icon': 'system1',
    'id': 19,
    'name': '系统管理',
    'noComponent': false,
    'path': '/system',
    'pid': 0,
    'sort': 0,
    'status': 1,
    'type': 1
  },
  {
    'alias': '',
    'hasChild': true,
    'hidden': 0,
    'icon': 'table',
    'id': 292,
    'name': '功能模块',
    'noComponent': false,
    'path': '/professionalWork',
    'pid': 0,
    'sort': 0,
    'status': 1,
    'children': [
      {
        'alias': '',
        'hidden': 0,
        'icon': 'example',
        'id': 293,
        'name': '表格',
        'noComponent': true,
        'path': 'table',
        'pid': 292,
        'sort': 10,
        'status': 1,
        'type': 0,
        children: [
          {
            id: 2965,
            'pid': 293,
            path: 'table1',
            name: '表格1',
            'status': 1,
            'type': 1,
            'icon': 'example',
            'noComponent': false
          },
          {
            id: 2966,
            'pid': 293,
            path: 'table2',
            name: '表格2',
            'type': 1,
            'status': 1,
            'icon': 'example',
            'noComponent': false
          }
        ]
      },
      {
        'alias': '',
        'hidden': 0,
        'icon': 'example',
        'id': 294,
        'name': '组件',
        'noComponent': true,
        'path': 'components',
        'pid': 292,
        'sort': 10,
        'status': 1,
        'type': 0,
        children: [
          {
            'id': Math.round(Math.random() * 100000),
            'pid': 294,
            path: 'vueCropper',
            name: '图片裁剪',
            'icon': 'example',
            'noComponent': false
          },
          {
            'id': Math.round(Math.random() * 100000),
            'pid': 294,
            path: 'scroll',
            name: '滚动条',
            'icon': 'example',
            'noComponent': false
          },
          {
            'id': Math.round(Math.random() * 100000),
            'pid': 294,
            path: 'tinymce',
            name: '富文本编辑器',
            'icon': 'example',
            'noComponent': false
          }
        ]
      }
    ],
    'type': 1
  }
];
const demoRoutes = [
  {
    path: '/professionalWork',
    component: 'Layout',
    name: 'ProfessionalWork',
    hidden: 0,
    meta:
      {
        title: '业务功能',
        icon: 'example'
      },
    children: [
      {
        path: 'table',
        name: 'Table',
        meta:
          {
            title: '表格',
            icon: 'example'
          },
        children: [
          {
            id: 211,
            path: 'table1',
            name: 'Table1',
            meta: {
              title: '综合表格',
              icon: ''
            }
          },
          {
            path: 'table2',
            name: 'Table2',
            title: '复杂表格',
            meta: {
              title: '复杂表格',
              icon: ''
            }
          }
        ]
      }
    ]
  },
  {
    path: '/experiment',
    component: 'Layout',
    meta:
      {
        title: '实验室',
        icon: 'example'
      },
    children: [
      {
        path: 'test',
        name: 'test',
        component: 'experiment/test',
        meta:
          {
            title: '测试',
            icon: 'example'
          }
      }
    ]
  }
];
const menus = [
  {
    id: 1,
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: 'noRedirect',
    sort: 0,
    type: 0,
    hidden: 0,
    isFrame: 0,
    status: 1,
    title: '系统管理',
    icon: 'example',
    children: [
      {
        id: 11,
        pid: 1,
        path: 'admin',
        name: 'Admin',
        component: 'system/admin',
        sort: 0,
        type: 1,
        hidden: 0,
        isFrame: 0,
        status: 1,
        children: [{
          id: 11111,
          pid: 11,
          title: '编辑',
          type: 2,
          alias: 'sys:admin:edit'
        }, {
          id: 11112,
          title: '新增',
          type: 2,
          alias: 'sys:admin:add',
          pid: 11
        }],
        title: '用户管理',
        icon: 'example'
      },
      {
        id: 12,
        path: 'resource',
        name: 'Resource',
        component: 'system/resource',
        sort: 0,
        type: 1,
        status: 1,
        title: '菜单管理',
        icon: 'mentus',
        isFrame: 0,
        pid: 1,
        hidden: false
      },
      {
        id: 13,
        path: 'roles',
        name: 'Roles',
        component: 'system/resource',
        sort: 0,
        type: 1,
        status: 1,
        pid: 1,
        title: '角色管理',
        icon: 'mentus',
        isFrame: 0,
        hidden: false
      }
    ]
  },
  {
    id: 2,
    path: '/professionalWork',
    component: 'Layout',
    name: 'ProfessionalWork',
    sort: 0,
    type: 0,
    isFrame: 0,
    hidden: 0,
    status: 1,
    title: '业务功能',
    icon: 'example',
    children: [
      {
        id: 21,
        pid: 2,
        path: 'table',
        name: 'Table',
        sort: 0,
        type: 1,
        isFrame: 0,
        status: 1,
        hidden: 0,
        title: '表格',
        icon: 'example',
        children: [
          {
            id: 211,
            path: 'table1',
            name: 'Table1',
            sort: 0,
            type: 1,
            pid: 21,
            status: 1,
            isFrame: 0,
            title: '综合表格',
            icon: ''
          },
          {
            id: 212,
            pid: 21,
            path: 'table2',
            name: 'Table2',
            sort: 0,
            type: 1,
            status: 1,
            isFrame: 0,
            title: '复杂表格',
            icon: ''
          }
        ]
      }
    ]
  },
  {
    id: 3,
    path: '/experiment',
    component: 'Layout',
    sort: 0,
    type: 0,
    status: 1,
    isFrame: 0,
    title: '实验室',
    icon: 'example',
    children: []
  }
];

module.exports = {
  adminRoutes,
  demoRoutes,
  menus
};
