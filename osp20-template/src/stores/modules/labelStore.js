const labelStore = {
  namespaced: true,
  state: {
    labelList: [],
  },
  getters: {
    getLabelList: state => {
      return state.labelList;
    },
    getLabel: state => (name) => {
      return state.labelList.find(label => label === name);
    },
  },
  mutations: {
    mountLabel: (state, labels) => {
      state.labelList = labels;
    },
    insertLabel: (state, name) => {
      if (!state.labelList.includes(name))
        state.labelList.splice(state.labelList.length, 0, name);
    },
    deleteLabel: (state, name) => {
      const _label = labelStore.getters.getLabel(state)(name);
      if(_label !== undefined) {
        const idx = state.labelList.indexOf(_label);
        state.labelList.splice(idx, 1);
      }
    },
  },
  actions: {
  },
}
  
export default labelStore;