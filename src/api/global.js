import request from '@/utils/request';

export function mockMenu(data) {
  return request({
    url: '/menus/routes',
    method: 'get',
    params: { data }
  });
}

export function rolesMenu() {
  return request({
    url: '/api/system/menu/permissions',
    method: 'post'
  });
}
