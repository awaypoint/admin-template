import request from '@/utils/request'

export function getStockList(data) {
  return request({
    url: 'getStockList',
    method: 'post',
    data
  })
}

export function getStockItems(data) {
  return request({
    url: 'getStockItems',
    method: 'post',
    data
  })
}

export function getStockLogList(data) {
  return request({
    url: 'getStockLogList',
    method: 'post',
    data
  })
}
