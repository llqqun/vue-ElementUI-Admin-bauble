import request from '@/utils/request';

export function getResourceList(params) {
  return request({
    url: '/resource/list',
    method: 'get',
    params
  });
}
export function delResource(params) {
  return request({
    url: '/resource/del',
    method: 'get',
    params
  });
}
export function saveResource(data) {
  return request({
    url: '/resource/save',
    method: 'post',
    data
  });
}
