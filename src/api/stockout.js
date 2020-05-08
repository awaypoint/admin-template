import request from '@/utils/request'

export function getStockOutList(data) {
  return request({
    url: 'getStockOutList',
    method: 'post',
    data
  })
}

export function addStockOut(data) {
  return request({
    url: 'addStockOut',
    method: 'post',
    data
  })
}

export function getStockOutDetail(data) {
  return request({
    url: 'getStockOutDetail',
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
