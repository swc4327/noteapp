import Vue from 'vue'
import Vuex from 'vuex'

import noteStore from './modules/noteStore.js'
import labelStore from './modules/labelStore.js'
import AIStore from './modules/AIStore.js'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    noteStore: noteStore,
    labelStore: labelStore,
    AIStore: AIStore,
  }
})

export default store;