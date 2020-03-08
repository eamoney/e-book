const book = {
  state: {
    fileName: null,
    menuVisible: false
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE': (state, menuVisible) => {
      state.menuVisible = menuVisible
    }
  },
  actions: {
    setFileName ({ commit, state }, fileName) {
      return commit('SET_FILENAME', fileName)
    },
    setMenuVisible ({ commit, state }, menuVisible) {
      return commit('SET_MENUVISIBLE', menuVisible)
    }
  }
}

export default book
