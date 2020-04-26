import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/api/system/login',
    method: 'post',
    data
  });
}

export function getInfo(id) {
  return request({
    url: '/api/system/auth/admin/detail/' + id,
    method: 'get'
  });
}

export function logout() {
  return request({
    url: '/mock/user/logout',
    method: 'post'
  });
}

