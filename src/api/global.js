import request from '@/utils/request';

export function mockMenu(data) {
  return request({
    url: '/user/routes',
    method: 'get',
    params: { data }
  });
}

export function rolesMenu() {
  return request({
    url: '/api/system/loginUser/menu/permissions',
    method: 'post'
  });
}
