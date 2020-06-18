const state = {
  selected: []
}

const mutations = {
  CHANGE_ATTR: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  setSelected({ commit }, data) {
    let selectedIds = data.map(row => {
      return row.id
    })
    commit('CHANGE_ATTR', { key: 'selected', value: selectedIds })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

