const state = {
  row: {},
  statusOptions: [
    { key: 1, label: '启用'},
    { key: 2, label: '禁用'}
  ],
  typeOptions: [
    { key: '1', label: '是'},
    { key: '2', label: '否'}
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

