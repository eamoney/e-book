const book = {
  state: {
    fileName: null
  },
  mutations: {
    'SET_FILENAME': (state, newTest) => {
      state.fileName = newTest
    }
  },
  actions: {
    setFileName ({ commit, state }, newTest) {
      return commit('SET_FILENAME', newTest)
    }
  }
}

export default book
