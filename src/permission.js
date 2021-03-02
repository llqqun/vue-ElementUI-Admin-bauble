import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start();

  document.title = getPageTitle(to.meta.title);

  const hasToken = getToken();
  console.log(hasToken)
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.userInfo.id;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          await store.dispatch('user/getInfo');
          const accessRoutes = await store.dispatch('permission/getUserMenu');
          router.addRoutes(accessRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          console.log(error);
          await store.dispatch('user/resetToken');
          Message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
