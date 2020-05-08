import request from '@/utils/request'

export function getStockInList(data) {
  return request({
    url: 'getStockInList',
    method: 'post',
    data
  })
}

export function addStockIn(data) {
  return request({
    url: 'addStockIn',
    method: 'post',
    data
  })
}

export function getStockInDetail(data) {
  return request({
    url: 'getStockInDetail',
    method: 'post',
    data
  })
}

export function updateStockIn(data) {
  return request({
    url: 'updateFactory',
    method: 'post',
    data
  })
}

export function delStockIn(data) {
  return request({
    url: 'delFactroy',
    method: 'post',
    data
  })
}
