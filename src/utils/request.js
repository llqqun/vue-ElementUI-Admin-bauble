import axios from 'axios';
import { Loading, MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

let loadingInstance;
let downFile;
function logOut() {
  Message.warning('您已经登出,请重新登录');
  store.dispatch('user/resetToken').then(() => {
    location.reload();
  });
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
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
    if (config.method === 'put') downFile = true;
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
    loadingInstance && loadingInstance.close();
    const res = response.data;
    // 文件下载
    if (downFile) {
      downFile = false;
      return { headers: response.headers, data: res };
    }
    // 普通请求
    if (res.code !== 0) {
      switch (res.code) {
        case 1:
          Message.error(res.message);
          break;
        case -1:
          Message.error('系统异常!');
          break;
        case 4000:
          Message.error('操作失败: ' + res.message);
          break;
        case 4002:
          Message.error('操作失败: ' + res.message);
          break;
        case 4003:
          logOut();
          break;
        case 4004:
          logOut();
          break;
        default:
          console.log(res);
          return false;
      }
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  error => {
    // 服务器连接出错处理
    const { config, code, message } = error;
    // 连接超时处理
    if (code === 'ECONNABORTED' || message === 'Network Error') {
      const errorConfig = config;
      // 如果配置不存在或重试属性未设置，抛出promise错误
      if (!errorConfig || !errorConfig.retry) return Promise.reject(error);
      // 设置一个变量记录重新请求的次数
      errorConfig.retryCount = errorConfig.retryCount || 0;
      // 检查重新请求的次数是否超过我们设定的请求次数
      if (errorConfig.retryCount >= errorConfig.retry) {
        Message({
          message: '网络请求失败,请稍后重试!',
          type: 'error',
          duration: 5 * 1000
        });
        loadingInstance && loadingInstance.close();
        return Promise.reject(error);
      }
      if (errorConfig.retryCount < 1) {
        Message({
          message: '网络连接超时,重新连接中.....!',
          type: 'warning',
          duration: 5 * 1000
        });
      }
      // 重新请求的次数自增
      errorConfig.retryCount += 1;
      // 创建新的Promise来处理重新请求的间隙
      var back = new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, errorConfig.retryInterval || 1000);
      });
      // 返回axios的实体，重试请求
      return back.then(function() {
        const request = { ...config };
        request.url = request.url.replace(request.baseURL, '');
        return service(request);
      });
    } else {
      Message({
        message: '服务器连接失败,请稍后再试!',
        type: 'error',
        duration: 5 * 1000
      });
      loadingInstance && loadingInstance.close();
      return Promise.reject(error);
    }
  }
);

export default service;
