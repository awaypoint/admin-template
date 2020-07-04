import request from '@/utils/request'

export function getInventoryList(data) {
  return request({
    url: 'getInventoryList',
    method: 'post',
    data
  })
}

export function addInventory(data) {
  return request({
    url: 'addInventory',
    method: 'post',
    data
  })
}

export function getInventoryDetail(data) {
  return request({
    url: 'getInventoryDetail',
    method: 'post',
    data
  })
}
