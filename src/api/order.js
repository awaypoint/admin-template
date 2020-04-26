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
