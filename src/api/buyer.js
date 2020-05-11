import request from '@/utils/request'

export function getBuyerList(data) {
  return request({
    url: 'getBuyerList',
    method: 'post',
    data
  })
}

export function updateBuyer(data) {
  return request({
    url: 'updateBuyer',
    method: 'post',
    data
  })
}