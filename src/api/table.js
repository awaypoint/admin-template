import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: 'fetchList',
    method: 'get',
    params
  })
}
