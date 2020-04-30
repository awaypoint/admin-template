import { login, logout, getInfo, modifyMyself } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roleName: '',
    username: '',
    mobile: '',
    guided: false,
    statusOptions: [
      { key: 1, label:'启用' },
      { key: 2, label:'禁用' }
    ]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE_NAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_USER_NAME: (state, username) => {
    state.username = username
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_GUIDED: (state, guided) => {
    state.guided = guided
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response.response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.response
        if (!data) {
          reject('登录失败，请重试！')
        }

        const userdata = data.user_data

        commit('SET_NAME', userdata.nickname)
        commit('SET_AVATAR', userdata.avatar)
        commit('SET_ROLE_NAME', data.role_name)
        commit('SET_USER_NAME', userdata.username)
        commit('SET_MOBILE', userdata.mobile)
        commit('SET_GUIDED', userdata.guided)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    const that = this
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  modifyUser({ commit }, data) {
    return new Promise(resolve => {
      const res = modifyMyself(data)
      commit('SET_MOBILE', data.mobile)
      commit('SET_NAME', data.nickname)
      commit('SET_AVATAR', data.avatar)
      resolve(res)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

