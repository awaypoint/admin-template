import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'onLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'getMyself',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}

export function getUserList(data) {
  return request({
    url: 'getUsersList',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: `addUser`,
    method: 'post',
    data
  })
}

export function modifyUser(data) {
  return request({
    url: `modifyUser`,
    method: 'post',
    data
  })
}

export function modifyPwd(data) {
  return request({
    url: `modifyPwd`,
    method: 'post',
    data
  })
}

export function removeUser(data) {
  return request({
    url: `delUser`,
    method: 'post',
    data
  })
}

export function resetPwd(data) {
  return request({
    url: `resetPwd`,
    method: 'post',
    data
  })
}

export function modifyMyself(data) {
  return request({
    url: `modifyMyself`,
    method: 'post',
    data
  })
}
