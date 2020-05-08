import request from '@/utils/request'

export function getProductList(data) {
  return request({
    url: 'getProductList',
    method: 'post',
    data
  })
}

export function getProductDetail(data) {
  return request({
    url: 'getProductDetail',
    method: 'post',
    data
  })
}

export function addProduct(data) {
  return request({
    url: 'addProduct',
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

export function delProduct(data) {
  return request({
    url: 'delProduct',
    method: 'post',
    data
  })
}

export function getSkuProducts(data) {
  return request({
    url: 'getSkuProducts',
    method: 'post',
    data
  })
}
