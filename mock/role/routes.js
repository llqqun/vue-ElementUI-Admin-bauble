
export const asyncRoutes = [
  {
    id: 1,
    path: '/system',
    title: '系统管理',
    icon: 'system1',
    children: [
      {
        id: 11,
        path: 'admin',
        title: '管理员管理'
      },
      {
        id: 12,
        icon: 'mentus',
        path: 'resource',
        title: '菜单管理'
      },
      {
        id: 13,
        path: 'roles',
        title: '角色管理'
      },
      {
        id: 14,
        path: 'configuration',
        title: '系统配置'
      },
      {
        id: 15,
        path: 'organization',
        title: '组织机构'
      },
      {
        id: 16,
        path: 'depPost',
        title: '部门职位'
      },
      {
        id: 17,
        path: 'dictionary',
        title: '数据字典'
      },
      {
        id: 18,
        path: 'timeOut',
        title: '定时任务'
      },
      {
        id: 19,
        path: 'taskLog',
        title: '任务日志',
        activeMenu: '/system/timeOut'
      },
      {
        id: 120,
        path: 'monitoringSYS',
        noCompoent: true,
        title: '系统监控',
        children: [
          {
            id: 121,
            path: 'loginRecord',
            title: '系统登入记录'
          },
          {
            id: 122,
            path: 'sysLog',
            title: '系统操作日志'
          },
          {
            id: 123,
            path: 'serviceState',
            title: '服务器状况'
          },
          {
            id: 124,
            path: 'online',
            title: '在线用户'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    path: '/professionalWork',
    title: '业务功能',
    icon: 'example',
    children: [
      {
        id: 21,
        path: 'table',
        title: '表格',
        children: [
          {
            id: 211,
            path: 'table1',
            title: '综合表格'
          },
          {
            id: 212,
            path: 'table2',
            title: '复杂表格'
          }
        ]
      },
      {
        id: 22,
        path: 'nested',
        title: '菜单嵌套',
        children: [
          {
            id: 221,
            path: 'menu1',
            title: '菜单1',
            children: [
              {
                id: 2211,
                path: 'menu1-1',
                title: '子菜单1-1'
              },
              {
                id: 2212,
                path: 'menu1-2',
                title: '子菜单1-2'
              }
            ]
          },
          {
            id: 222,
            path: 'menu2',
            title: '菜单2'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    path: '/experiment',
    title: '实验室',
    icon: 'example',
    children: []
  }
];
