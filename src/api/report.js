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

export function getOrderStatistics(data) {
  return request({
    url: 'getOrderStatistics',
    method: 'post',
    data
  })
}

export function getOrderSumary(data) {
  return request({
    url: 'getOrderSumary',
    method: 'post',
    data
  })
}

export function getStockStatistics(data) {
  return request({
    url: 'getStockStatistics',
    method: 'post',
    data
  })
}

export function getStockSumary(data) {
  return request({
    url: 'getStockSumary',
    method: 'post',
    data
  })
}

export function getProductSale(data) {
  return request({
    url: 'getProductSale',
    method: 'post',
    data
  })
}

export function getProductSaleSumary(data) {
  return request({
    url: 'getProductSaleSumary',
    method: 'post',
    data
  })
}

export function getProductProfit(data) {
  return request({
    url: 'getProductProfit',
    method: 'post',
    data
  })
}

export function getProductProfitSumary(data) {
  return request({
    url: 'getProductProfitSumary',
    method: 'post',
    data
  })
}
