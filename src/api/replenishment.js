import request from '@/utils/request'

export function getRepList(data) {
  return request({
    url: 'getRepList',
    method: 'post',
    data
  })
}

export function addRep(data) {
  return request({
    url: 'addRep',
    method: 'post',
    data
  })
}

export function getRepDetail(data) {
  return request({
    url: 'getRepDetail',
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
