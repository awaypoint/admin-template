import request from '@/utils/request'

export function removeUser(data) {
  return request({
    url: `/user/remove`,
    method: 'post',
    data
  })
}

/**
 * 角色管理
 * **/

export function getRoles(data) {
  return request({
    url: `getRolesList`,
    method: 'post',
    data
  })
}

export function getRolesCombo() {
  return request({
    url: `getRolesCombo`,
    method: 'get'
  })
}

export function getAllMenus() {
  return request({
    url: `getAllMenus`,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: `addRole`,
    method: 'post',
    data
  })
}

export function getRolePermission(data) {
  return request({
    url: `getRolePermission`,
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `updateRole`,
    method: 'post',
    data
  })
}

export function removeRole(data) {
  return request({
    url: `delRole`,
    method: 'post',
    data
  })
}

/**
 * 准备同步阿里巴巴数据
 * @param {Object}} data
 */
export function prepareAsyn(data) {
  return request({
    url: `prepareAsyn`,
    method: 'post',
    data
  })
}

/**
 * 同步阿里巴巴数据
 * @param {Object}} data
 */
export function asynData(data) {
  return request({
    url: `asynData`,
    method: 'post',
    data
  })
}

export function getSetting(data) {
  return request({
    url: `getSetting`,
    method: 'post',
    data
  })
}

export function updateSetting(data) {
  return request({
    url: `updateSetting`,
    method: 'post',
    data
  })
}
