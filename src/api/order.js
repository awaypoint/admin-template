import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: 'getOrderList',
    method: 'post',
    data
  })
}

export function getOrderDetail(data) {
  return request({
    url: 'getOrderDetail',
    method: 'post',
    data
  })
}

export function brushOrder(data) {
  return request({
    url: 'brushOrder',
    method: 'post',
    data
  })
}

export function getPrinterOrders(data) {
  return request({
    url: 'getPrinterOrders',
    method: 'post',
    data
  })
}

export function multStockOut(data) {
  return request({
    url: 'multStockOut',
    method: 'post',
    data
  })
}
