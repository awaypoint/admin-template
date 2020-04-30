import request from '@/utils/request'

export function getFactoryList(data) {
  return request({
    url: 'getFactoryList',
    method: 'post',
    data
  })
}

export function addFactory(data) {
  return request({
    url: 'addFactory',
    method: 'post',
    data
  })
}

export function updateFactory(data) {
  return request({
    url: 'updateFactory',
    method: 'post',
    data
  })
}

export function delFactory(data) {
  return request({
    url: 'delFactroy',
    method: 'post',
    data
  })
}
