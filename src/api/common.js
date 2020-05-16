import request from '@/utils/request';
import { Message } from 'element-ui';
/**
 * @param str   源字符串
 * @param incise  1级符号
 * @param seek  需求字符
 * @param division  2级符号
 */
function formatch(str, incise = '', seek, division = '') {
  if (division && division !== '') {
    let name = '';
    const strArr = str.split(division);
    strArr.some(item => {
      if (item.indexOf(seek) !== -1) {
        if (incise && incise !== '') {
          name = item.substring(item.indexOf(incise) + 1);
          return true;
        } else {
          name = item.substring(item.indexOf(seek) + seek.length);
          return true;
        }
      }
    });
    return name;
  } else {
    return false;
  }
}

export function get(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  });
}

export function post(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  });
}

export function put(url, data) {
  return request({
    url: url,
    method: 'put',
    data
  });
}

export function deleteData(url) {
  return request({
    url: url,
    method: 'delete'
  });
}

export function downloadFile(url, method, param, fileName) {
  return request({
    url: url,
    method: method,
    params: param,
    data: param,
    responseType: 'blob'
  }).then(res => {
    const obj = new Blob([res]);
    if (res.data.type === 'application/json') {
      Message.error('文件不存在或已过期');
      return;
    }
    const url = window.URL.createObjectURL(obj);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }).catch(error => {
    return new Error(error);
  });
}

export function getOrgSelect(params) {
  return request({
    url: '/api/system/auth/org/tree',
    method: 'get',
    params
  });
}

export function getDepSelect(id) {
  return request({
    url: '/api/system/auth/dept/tree?orgId=' + id,
    method: 'get'
  });
}

export function getJobSelect(id) {
  return request({
    url: '/api/system/auth/job/list/dept/' + id,
    method: 'get'
  });
}

export function getDictionary(id) {
  return request({
    url: '/api/sys/dict/detail/list/code/' + id,
    method: 'get'
  });
}
