import { createStore } from 'vuex'
import helper from './helper'
import category from './modules/category'
import admin from './modules/auth'
import user from './modules/users'
import product from './modules/product'

export default createStore({
  state: {
    isLoading: false,
  },
  getters: {
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.isLoading = payload;
    }
  },
  actions: {
    setLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading);
    }
  },
  modules: {
    helper,
    category,
    admin,
    product,
    user
  }
})
