import axios from 'axios';
import { Loading, MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

let loadingInstance;

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // 超时设置
  retry: 3, // 请求次数
  retryInterval: 1000
});

// request interceptor
service.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({ text: '', spinner: 'loading', background: 'rgba(0, 0, 0, 0.2)' });
    if (store.getters.token) {
      config.headers['Authorization'] = 'bearer ' + getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    loadingInstance.close();
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 200 && res.code !== 0) {
      if (res.code === 203) {
        MessageBox.alert('您已经登出,请重新登录', '注销', {
          confirmButtonText: '重新登入',
          callback: action => {
            store.dispatch('user/resetToken').then(() => {
              location.reload();
            });
          }
        });
      } else {
        Message({
          message: res.message || '系统繁忙,请稍后再试!',
          type: 'error',
          duration: 5 * 1000
        });
      }
      loadingInstance.close();
      return Promise.reject(new Error(res.message || '系统繁忙,请稍后再试!'));
    } else {
      loadingInstance.close();
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    loadingInstance.close();
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
