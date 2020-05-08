const state = {
  row: {},
  urgencyOptions: [
    { key: '1', label: '普通'},
    { key: '2', label: '紧急'},
    { key: '3', label: '加急'}
  ],
  urgencyMap: {
    '1': '普通',
    '2': '紧急',
    '3': '加急',
  },
  reachedOptions: [
    { key: '1', label: '是'},
    { key: '2', label: '否'}
  ],
  reachecMap: {
    '1': '是',
    '2': '否'
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

