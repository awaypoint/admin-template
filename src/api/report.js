import request from '@/utils/request'

export function getReport(data) {
  return request({
    url: 'getReport',
    method: 'post',
    data
  })
}
