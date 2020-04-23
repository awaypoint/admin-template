import request from '@/utils/request'

export function getShopList(data) {
  return request({
    url: 'getShopList',
    method: 'post',
    data
  })
}

export function addShop(data) {
  return request({
    url: 'addShop',
    method: 'post',
    data
  })
}

export function updateShop(data) {
  return request({
    url: 'updateShop',
    method: 'post',
    data
  })
}

export function delShop(data) {
  return request({
    url: 'delShop',
    method: 'post',
    data
  })
}
