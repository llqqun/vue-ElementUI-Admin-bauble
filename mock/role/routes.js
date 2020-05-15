
export const asyncRoutes = [
  {
    id: 1,
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: 'noRedirect',
    hidden: false,
    meta:
      {
        title: '系统管理',
        icon: 'example'
      },
    children: [
      {
        id: 11,
        path: 'admin',
        name: 'Admin',
        component: 'system/admin',
        hidden: false,
        meta:
          {
            title: '用户管理',
            icon: 'example'
          }
      },
      {
        id: 12,
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
        id: 13,
        path: 'roles',
        name: 'Roles',
        component: 'system/resource',
        meta:
          {
            title: '角色管理',
            icon: 'mentus'
          },
        hidden: false
      }
    ]
  },
  {
    id: 2,
    path: '/professionalWork',
    component: 'Layout',
    name: 'ProfessionalWork',
    hidden: false,
    meta:
      {
        title: '业务功能',
        icon: 'example'
      },
    children: [
      {
        id: 21,
        path: 'table',
        name: 'Table',
        hidden: false,
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
            id: 212,
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
    id: 3,
    path: '/experiment',
    component: 'Layout',
    meta:
      {
        title: '实验室',
        icon: 'example'
      },
    children: []
  }
];
