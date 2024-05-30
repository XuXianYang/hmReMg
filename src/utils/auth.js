import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const TokenTimestamp = 'vue_admin_template_TokenTimestamp'


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenTimestamp() {
  return Cookies.get(TokenTimestamp)
}

export function setTokenTimestamp() {
  return Cookies.set(TokenTimestamp, Date.now())
}