import Cookies from 'js-cookie';

const TokenKey = 'back_token';
const UserID = 'back_sort';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getUserID() {
  return Cookies.get(UserID);
}

export function setUserID(data) {
  return Cookies.set(UserID, data);
}

export function removeUserID() {
  return Cookies.remove(UserID);
}
