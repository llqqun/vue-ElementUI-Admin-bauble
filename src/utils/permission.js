import store from '@/store';

/**
 * @param {string|number} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  const roles = store.getters && store.getters.btnRoles;
  if (Array.isArray(roles) && roles.length) {
    return roles.includes(value);
  } else {
    return false;
  }
}
