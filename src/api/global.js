import request from '@/utils/request';

export function getYZM() {
  return request({
    url: '/mock/code',
    method: 'get'
  });
}
export function mockMenu(data) {
  return request({
    url: '/menus',
    method: 'get',
    params: { data }
  });
}
export function mockRouter(data) {
  return request({
    url: '/routes',
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
