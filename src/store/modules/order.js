const state = {
  row: {},
  typeOptions: [
    { key: '1', label: '正常'},
    { key: '2', label: '刷单'}
  ],
  typeMap: {
    1: '正常',
    2: '刷单'
  },
  resourceOptions: [
    { key: '1', label: '线上单'},
    { key: '2', label: '线下单'}
  ]
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

