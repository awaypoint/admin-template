/**
 * 除了特殊功能，其他的常量都放这里
 */
const state = {
  //buyer
  buyerTypeList: [
    { key: '1', label: '线上买家' },
    { key: '2', label: '线下买家' }
  ],
  buyerTypeMap: {
    '1': '线上买家',
    '2': '线下买家'
  },
  //stockin
  stockInStatusOptions: [
    { key: '1', label: '待处理' },
    { key: '2', label: '已入库' }
  ],
  stockInStatusMap: {
    '1': '待处理',
    '2': '已入库'
  },
  //replenishment
  replenishmentUrgencyOptions: [
    { key: '1', label: '普通' },
    { key: '2', label: '紧急' },
    { key: '3', label: '加急' }
  ],
  replenishmentUrgencyMap: {
    '1': '普通',
    '2': '紧急',
    '3': '加急',
  },
  //product
  colorOptions: [
    { value: false, label: '红色', img: '' },
    { value: false, label: '白色', img: ''  },
    { value: false, label: '绿色', img: ''  },
    { value: false, label: '黑色', img: ''  },
    { value: false, label: '紫色', img: ''  },
    { value: false, label: '蓝色', img: ''  },
    { value: false, label: '灰色', img: ''  }
  ],
  sizeOptions: [
    { value: false, label: 'S' },
    { value: false, label: 'M' },
    { value: false, label: 'L' },
    { value: false, label: 'XL' },
    { value: false, label: 'XXL' },
    { value: false, label: 'XXXL' }
  ],
  sizeSort: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  sizeTableOptions: [
    { value: true, label: '胸围' },
    { value: true, label: '腰围' },
    { value: true, label: '臀围' },
    { value: true, label: '袖长' },
    { value: true, label: '上衣长' },
    { value: true, label: '裤长' }
  ],
  sizeTableEnMap: {
    '胸围': 'Bust',
    '腰围': 'Waist',
    '臀围': 'Hip',
    '袖长': 'Sleeve',
    '上衣长': 'Top',
    '裤长': 'Pants',
  },
  //stock
  logTypeOptions: [
    { key: '1', label: '入库' },
    { key: '2', label: '出库' },
    { key: '5', label: '补发' },
    { key: '7', label: '盘点' }
  ],
  logTypeMap: {
    '1': '入库',
    '2': '撤销入库',
    '3': '出库',
    '4': '撤销出库',
    '5': '补发',
    '7': '盘点'
  },
  //statistics
  sumaryTypeOptions: [
    { key: 'all', label: '年' },
    { key: 'year', label: '月' },
    { key: 'month', label: '日' }
  ],
  //common
  query: {},
  boolOptions: [
    { key: '1', label: '是' },
    { key: '2', label: '否' }
  ],
  boolMap: {
    '1': '是',
    '2': '否'
  },
  statusOptions: [
    { key: 1, label: '启用' },
    { key: 2, label: '禁用' }
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
  setQuery({ commit }, data) {
    commit('CHANGE_ATTR', { key: 'query', value: data })
  },
  clearQuery({ commit }) {
    commit('CHANGE_ATTR', { key: 'query', value: {} })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

