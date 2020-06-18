import request from '@/utils/request'

export function getReport(data) {
  return request({
    url: 'getReport',
    method: 'post',
    data
  })
}

export function bestSale(data) {
  return request({
    url: 'bestSale',
    method: 'post',
    data
  })
}

export function getTodayBuyers(data) {
  return request({
    url: 'getTodayBuyers',
    method: 'post',
    data
  })
}

export function getOverOrders(data) {
  return request({
    url: 'getOverOrders',
    method: 'post',
    data
  })
}
