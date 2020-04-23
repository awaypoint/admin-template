import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'getFactoryList',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'addFactory',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'updateFactory',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'delFactroy',
    method: 'post',
    data
  })
}
