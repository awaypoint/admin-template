/**
 * 除了特殊功能，其他的常量都放这里
 */
const state = {
  //order
  orderTypeOptions: [
    { key: '1', label: '正常'},
    { key: '2', label: '刷单'}
  ],
  orderTypeMap: {
    1: '正常',
    2: '刷单'
  },
  orderResourceOptions: [
    { key: '1', label: '线上单'},
    { key: '2', label: '线下单'}
  ],
  //shop
  shopTypeList: [
    { key: '1', label: '普通店铺'},
    { key: '2', label: '1688店铺'}
  ],
  shopTypeMap: {
    '1': '普通店铺',
    '2': '1688店铺'
  },
  //stockin
  stockInStatusOptions: [
    { key: '1', label: '待处理'},
    { key: '2', label: '已入库'}
  ],
  stockInStatusMap: {
    '1': '待处理',
    '2': '已入库'
  },
  //replenishment
  replenishmentUrgencyOptions: [
    { key: '1', label: '普通'},
    { key: '2', label: '紧急'},
    { key: '3', label: '加急'}
  ],
  replenishmentUrgencyMap: {
    '1': '普通',
    '2': '紧急',
    '3': '加急',
  },
  //common
  boolOptions: [
    { key: '1', label: '是'},
    { key: '2', label: '否'}
  ],
  boolMap: {
    '1': '是',
    '2': '否'
  },
  statusOptions: [
    { key: 1, label: '启用'},
    { key: 2, label: '禁用'}
  ],
  pickerOptions: {
    shortcuts: [{
      text: '最近一周',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
      }
    }, {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
      }
    }]
  }
}

const mutations = {
  CHANGE_ATTR: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  setRow({ commit }, data) {
    commit('CHANGE_ATTR', { key: 'row', value: data })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

