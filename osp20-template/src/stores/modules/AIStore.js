const AIStore = {
  namespaced: true,
  state: {
    model: "",
  },
  getters: {
    getModel: (state) => {
      return state.model;
    }
  },
  mutations: {
    mountModel: (state, model) => {
      state.model = model;
    },
  },
  actions: {
  },
}
  
export default AIStore;