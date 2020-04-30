const state = {
  row: {},
  typeList: [
    { id: '1', name: '普通店铺'},
    { id: '2', name: '1688店铺'}
  ],
  typeMap: {
    '1': '普通店铺',
    '2': '1688店铺'
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

