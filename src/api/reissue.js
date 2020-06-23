import request from '@/utils/request'

export function getReissueItems(data) {
  return request({
    url: 'getReissueItems',
    method: 'post',
    data
  })
}

export function addReissue(data) {
  return request({
    url: 'addReissue',
    method: 'post',
    data
  })
}

export function getReissueDetail(data) {
  return request({
    url: 'getReissueDetail',
    method: 'post',
    data
  })
}
