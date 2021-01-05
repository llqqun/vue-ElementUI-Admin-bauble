const adminRoutes = [
  {
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: 'noRedirect',
    meta:
      {
        title: '系统管理',
        icon: 'example'
      },
    children: [
      {
        path: 'resource',
        name: 'Resource',
        component: 'system/resource',
        meta:
          {
            title: '菜单管理',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'admin',
        name: 'Admin',
        component: 'system/admin',
        hidden: 0,
        meta:
          {
            title: '用户管理',
            icon: 'example'
          }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: 'system/roles',
        meta:
          {
            title: '角色管理',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'organization',
        name: 'Organization',
        component: 'system/organization',
        meta:
          {
            title: '组织机构',
            icon: 'mentus'
          },
        hidden: false
      },
      {
        path: 'monitoringSYS',
        noCompoent: true,
        meta: {
          title: '系统监控',
          icon: 'mentus'
        },
        children: [{
          path: 'loginRecord',
          name: 'LoginRecord',
          component: 'system/monitoring/loginRecord',
          meta: {
            title: '系统登入记录'
          }
        },
        {
          path: 'sysLog',
          name: 'SysLog',
          component: 'system/monitoring/sysLog',
          meta: {
            title: '系统操作日志'
          }
        },
        {
          path: 'serviceState',
          name: 'ServiceState',
          component: 'system/monitoring/serviceState',
          meta: {
            title: '服务器状况'
          }
        },
        {
          path: 'online',
          name: 'Online',
          component: 'system/monitoring/online',
          meta: {
            title: '在线用户'
          }
        }
        ]
      },
      {
        path: 'https://www.baidu.com',
        component: 'Layout',
        meta:
          {
            title: '百度搜索',
            icon: 'mentus'
          },
        hidden: false
      }
    ]
  },
  {
    path: '/professionalWork',
    component: 'Layout',
    hidden: 0,
    meta:
      {
        title: '业务功能',
        icon: 'example'
      },
    children: [
      {
        path: 'table',
        noCompoent: true,
        meta:
          {
            title: '表格',
            icon: 'example'
          },
        children: [
          {
            path: 'table1',
            name: 'Table1',
            component: 'professionalWork/table/table1',
            meta: {
              title: '综合表格',
              icon: ''
            }
          },
          {
            path: 'table2',
            name: 'Table2',
            component: 'professionalWork/table/table2',
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
        path: 'components',
        noCompoent: true,
        meta:
          {
            title: '组件',
            icon: 'example'
          },
        children: [
          {
            path: 'vueCropper',
            name: 'VueCropper',
            component: 'professionalWork/components/vueCropper',
            meta: {
              title: '图片裁剪',
              icon: ''
            }
          },
          {
            path: 'spider',
            name: 'Spider',
            component: 'professionalWork/components/spider',
            meta: {
              title: '蜘蛛',
              icon: ''
            }
          }
        ]
      }
    ]
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
