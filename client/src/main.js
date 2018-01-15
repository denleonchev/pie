import Vue from 'vue'
import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import VueClipboard from 'vue-clipboard2'

import App from './App.vue'
import store from './data'
import router from './router'

Vue.use(Vuex)
Vue.use(VueMaterial)
Vue.use(VueClipboard)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
