import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/api/system/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/api/user/inform',
    method: 'get',
    params: { token }
  });
}

export function logout() {
  return request({
    url: '/mock/user/logout',
    method: 'post'
  });
}

