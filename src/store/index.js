import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isConnect: false,
    isClickDatabase: false,
  },
  mutations: {
    isShowConnect(state) {
      state.isConnect = !state.isConnect
    },
    isShowSearch(state, isShow) {
      state.isClickDatabase = isShow
    },
  },
  actions: {},
  getters: {},
  modules: {},
})
