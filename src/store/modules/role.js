const state = {
  permissionList: []
}

const mutations = {
  CHANGE_ATTR: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  setAllMenus({ commit }, data) {
    commit('CHANGE_ATTR', { key: 'permissionList', value: data })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

