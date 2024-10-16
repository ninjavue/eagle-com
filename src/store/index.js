import { createStore } from 'vuex'
import helper from './helper'
import category from './modules/category'
import admin from './modules/auth'
import user from './modules/users'
import product from './modules/product'

export default createStore({
  state: {
    isLoading: false,
    darkMode: true,
  },
  getters: {
    isDarkMode(state) {
      return state.darkMode
    }
  },
  mutations: {
    SET_LOADING(state, payload) {
      state.isLoading = payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
    }
  },
  actions: {
    setLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading);
    },
    toggleDarkMode({ commit }) {
      commit('toggleDarkMode')
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
