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

export function getPrintOutOrders(data) {
  return request({
    url: 'getPrintOutOrders',
    method: 'post',
    data
  })
}
