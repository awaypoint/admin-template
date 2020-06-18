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

export function cancelStockIn(data) {
  return request({
    url: 'cancelStockIn',
    method: 'post',
    data
  })
}
