import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book.js'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book
  },
  getters
})
