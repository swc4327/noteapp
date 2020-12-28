import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueMoment from 'vue-moment' 
import VueUUID from 'vue-uuid'
import App from './App.vue'

import store from './stores/index.js'

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(VueMoment);
Vue.use(VueUUID);
Vue.config.productionTip = false

// Vue instance 생성
new Vue({
  render: h => h(App),
  // Vuex의 store를 추가
  store,
}).$mount('#app')
