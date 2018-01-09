import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import VueClipboard from 'vue-clipboard2'

import App from './App.vue'
Vue.use(VueMaterial)
Vue.use(VueClipboard)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App)
})
