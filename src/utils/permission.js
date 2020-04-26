import store from '@/store';

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.btnRoles;
    const permissionRoles = value;
    return roles.some(role => {
      return permissionRoles.includes(role);
    });
  } else {
    console.error(`参数错误!`);
    return false;
  }
}
