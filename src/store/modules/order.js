const state = {
  orderTypeOptions: [
    { key: '1', label: '正常' },
    { key: '2', label: '刷单' }
  ],
  orderTypeMap: {
    1: '正常',
    2: '刷单'
  },
  orderResourceOptions: [
    { key: '1', label: '线上单' },
    { key: '2', label: '线下单' }
  ],
  orderStatusOptions:[
    { key: 'waitbuyerpay', label: '等待买家付款' },
    { key: 'waitsellersend', label: '等待卖家发货' },
    { key: 'waitbuyerreceive', label: '等待买家确认收货' },
    { key: 'success', label: '交易成功' },
    { key: 'cancel', label: '交易关闭' },
    { key: 'paid_but_not_fund', label: '已支付，未到账' },
    { key: 'confirm_goods', label: '已收货' },
    { key: 'waitsellerconfirm', label: '等待卖家确认订单' },
    { key: 'waitbuyerconfirm', label: '等待买家确认订单' },
    { key: 'confirm_goods_but_not_fund', label: '已收货，未到账' },
    { key: 'confirm_goods_and_has_subsidy', label: '已收货，已贴现' },
    { key: 'send_goods_but_not_fund', label: '已发货，未到账' },
    { key: 'waitlogisticstakein', label: '等待物流揽件' },
    { key: 'waitbuyersign', label: '等待买家签收' },
    { key: 'signinsuccess', label: '买家已签收' },
    { key: 'signinfailed', label: '签收失败' },
    { key: 'waitbuyerconfirmaction', label: '等待买家确认操作' },
    { key: 'waitsellerpush', label: '等待卖家推进' }
  ],
  orderStatusMap: {
    'waitbuyerpay': '等待买家付款',
    'waitsellersend': '等待卖家发货',
    'waitbuyerreceive': '等待买家确认收货',
    'success': '交易成功',
    'cancel': '交易关闭',
    'paid_but_not_fund': '已支付，未到账',
    'confirm_goods': '已收货',
    'waitsellerconfirm': '等待卖家确认订单',
    'waitbuyerconfirm': '等待买家确认订单',
    'confirm_goods_but_not_fund': '已收货，未到账',
    'send_goods_but_not_fund': '已发货，未到账',
    'waitlogisticstakein': '等待物流揽件',
    'waitbuyersign': '等待买家签收',
    'signinsuccess': '买家已签收',
    'signinfailed': '签收失败',
    'waitbuyerconfirmaction': '等待买家确认操作',
    'waitsellerpush': '等待卖家推进'
  },
  selectOrderIds: []
}

const mutations = {
  CHANGE_ATTR: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  setSelectOrders({ commit }, data) {
    localStorage.setItem("selectOrderIds", JSON.stringify(data));
    // commit('CHANGE_ATTR', { key: 'selectOrderIds', value: data })
  },
  setSelectStockout({ commit }, data) {
    localStorage.setItem("selectStockoutIds", JSON.stringify(data));
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

